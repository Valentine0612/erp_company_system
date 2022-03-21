import type { NextPage } from "next";
import { managersAccountNavbarList } from "constants/navbarLists";
import React, { useEffect, useState } from "react";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { UserID } from "types/User";
import { CompanyAPI, CompanyAPIGetCompanyEmployeeByIdData } from "api/CompanyAPI";
import { PrettyUtils } from "utils/PrettyUtils";
import styles from "styles/pages/manager/employee/ManagerEmployeeTasksPage.module.scss";
import { Table } from "components/shared/Table";
import { TaskAPI, TaskAPIGetAllTasksResponseData } from "api/TaskAPI";
import { Task, TaskStateEnum, TaskStates } from "types/Task";
import { DEFAULT_PAGINATION_LIMIT, Pagination } from "types/Pagination";
import { useDispatch } from "react-redux";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { PaginationControl } from "components/shared/PaginationControl";
import Head from "next/head";
import { Breadcrumbs } from "components/shared/Breadcrumbs";
import { RoutesCreator } from "utils/RoutesCreator";
import { StoreWrapper } from "utils/StoreWrapper";
import { StateSwitcher } from "components/shared";

const ManagerEmployeeTasksPage: NextPage<ManagerEmployeeTasksProps> = (props) => {
    const [selectedTaskState, setSelectedTaskState] = useState<TaskStateEnum | undefined>(undefined);
    const [tasksPagination, setTasksPagination] = useState<Pagination<Task>>(props.tasks);
    const [selectedPaginationPage, setSelectedPaginationPage] = useState<number>(0);

    const dispatch = useDispatch();

    async function updateTaskPagination() {
        const tasksResult = await TaskAPI.getAllTasks({
            user: props.employee.id as UserID,
            state: selectedTaskState,
            limit: DEFAULT_PAGINATION_LIMIT,
            offset: selectedPaginationPage * DEFAULT_PAGINATION_LIMIT,
        });

        if (tasksResult.status === 200) return setTasksPagination(tasksResult.data);

        dispatch(AlertionActionCreator.createAlerion("Ошибка получения заданий", "error"));
        console.log(tasksResult);
    }

    useEffect(() => {
        updateTaskPagination();
    }, [selectedTaskState, selectedPaginationPage]);

    return (
        <>
            <Head>
                <title>Задания {PrettyUtils.getUserFullName(props.employee)} | CyberPay</title>
            </Head>

            <AccountPageWrapper navbarList={managersAccountNavbarList}>
                <Breadcrumbs
                    list={[
                        { text: "Кабинет менеджера", url: RoutesCreator.getManagerRoute() },
                        { text: "Исполнители", url: RoutesCreator.getManagerRoute() },
                        {
                            text: PrettyUtils.getUserFullName(props.employee),
                            url: RoutesCreator.getManagerEmployeeRoute(props.employee.id),
                        },
                        {
                            text: "Задания",
                            url: RoutesCreator.getManagerEmployeeTasksRoute(props.employee.id),
                        },
                    ]}
                />

                <h2 className={styles.pageTitle}>
                    Задания {PrettyUtils.getUserFullName(props.employee)} <span>{tasksPagination.results.length}</span>
                </h2>

                <StateSwitcher
                    keyText={"EmployeeTaskState__"}
                    list={Object.entries(TaskStates).map(([state, text]) => {
                        return { state: state as TaskStateEnum, text };
                    })}
                    onSelectItem={(item) => setSelectedTaskState(item && item.state)}
                />

                <Table className={styles.table}>
                    <div className={styles.tableLine}>
                        <span>Название</span>
                        <span>Информация</span>
                    </div>

                    {(tasksPagination.results.length &&
                        tasksPagination.results.map((task, index) => (
                            <a
                                href={RoutesCreator.getManagerTaskRoute(task.id)}
                                className={styles.tableLine}
                                key={"tasksTable__item__" + index}
                            >
                                <div>
                                    <h4 className={styles.taskTitle}>{task.title}</h4>
                                    <div className={styles.taskDescription}>{task.description}</div>
                                </div>

                                <div>
                                    <div className={styles.taskInfo}>
                                        Дата начала: <span>{PrettyUtils.getFormattedDate(task.from_date, true)}</span>
                                    </div>
                                    <div className={styles.taskInfo}>
                                        Выполнить до: <span>{PrettyUtils.getFormattedDate(task.to_date, true)}</span>
                                    </div>
                                    <div className={styles.taskInfo}>
                                        Стоимость: <span>{task.price}</span>
                                    </div>
                                    <div className={styles.taskInfo}>
                                        Состояние: <span>{TaskStates[task.state]}</span>
                                    </div>
                                    <div className={styles.taskInfo}>
                                        Закрывающий документ отправлен: <span>{task.is_completed ? "Да" : "Нет"}</span>
                                    </div>
                                    {task.status && (
                                        <div className={styles.taskInfo}>
                                            Статус оплаты: <span>{task.status}</span>
                                        </div>
                                    )}
                                </div>
                            </a>
                        ))) || <div className={styles.tableLine}>Пока нет заданий</div>}
                </Table>

                <PaginationControl
                    itemsCount={tasksPagination.count}
                    onPageSelected={(pageNumber) => setSelectedPaginationPage(pageNumber - 1)}
                />
            </AccountPageWrapper>
        </>
    );
};

ManagerEmployeeTasksPage.getInitialProps = StoreWrapper.getInitialPageProps<ManagerEmployeeTasksProps>(
    {
        notAuthenticatedRedirect: "/",
        storeRedirect: {
            redirect: (store) => !store.user.userInfo?.manager,
            redirectLocation: "/",
        },
        hasQueryParams: { params: ["id"], redirectLocation: "/" },
    },
    () => async (context) => {
        const employeeResult = await CompanyAPI.getCompanyEmployeeById(Number(context.query.id), context.req);

        if (employeeResult.status !== 200) {
            context.res?.writeHead(302, { Location: "/" });
            context.res?.end();
            return;
        }

        const tasksResult = await TaskAPI.getAllTasks(
            { user: employeeResult.data.id as UserID, limit: DEFAULT_PAGINATION_LIMIT, offset: 0 },
            context.req
        );

        if (tasksResult.status !== 200) {
            context.res?.writeHead(302, { Location: "/" });
            context.res?.end();
            return;
        }

        return { employee: employeeResult.data, tasks: tasksResult.data };
    }
);

type ManagerEmployeeTasksProps = {
    employee: CompanyAPIGetCompanyEmployeeByIdData;
    tasks: TaskAPIGetAllTasksResponseData;
};

export default ManagerEmployeeTasksPage;
