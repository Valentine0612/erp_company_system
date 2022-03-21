import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { employeeAccountNavbarList } from "constants/navbarLists";
import styles from "styles/pages/employee/tasks/EmployeeAllTasksPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import Head from "next/head";
import { TaskAPI, TaskAPIGetAllTasksByEmployeeResponseData } from "api/TaskAPI";
import { defaultPagination, DEFAULT_PAGINATION_LIMIT } from "types/Pagination";
import { PrettyUtils } from "utils/PrettyUtils";
import { TaskState, TaskStateEnum, TaskStates } from "types/Task";
import { RoutesCreator } from "utils/RoutesCreator";
import { Table, PaginationControl, Breadcrumbs, StateSwitcher } from "components/shared";
import { StoreWrapper } from "utils/StoreWrapper";
import { IState } from "store";

const EmployeeAllTasksPage: NextPage<EmployeeAllTasksPageProps> = (props) => {
    const [selectedTasksPaginationPage, setSelectedTasksPaginationPage] = useState(0);
    const [tasksPagination, setTasksPagination] = useState(props.tasks);
    const [selectedTaskState, setSelectedTaskState] = useState<TaskState | undefined>(undefined);

    const user = useSelector((store: IState) => store.user.userInfo);

    const dispatch = useDispatch();

    useEffect(() => {
        updateTasksPagination();
    }, [selectedTasksPaginationPage, selectedTaskState]);

    async function updateTasksPagination() {
        if (!user?.verified)
            return dispatch(
                AlertionActionCreator.createAlerion(
                    "У вас нет прав на просмотр заданий. Ваш аккаунт еще не проверен администратором.",
                    "error",
                    5000
                )
            );

        if (user?.banned)
            return dispatch(AlertionActionCreator.createAlerion("У вас нет прав на просмотр заданий.", "error", 5000));

        const tasksResult = await TaskAPI.getAllTasksByEmployee({
            state: selectedTaskState,
            limit: DEFAULT_PAGINATION_LIMIT,
            offset: selectedTasksPaginationPage * DEFAULT_PAGINATION_LIMIT,
        });

        if (tasksResult.status === 200) return setTasksPagination(tasksResult.data);

        dispatch(AlertionActionCreator.createAlerion("Ошибка загрузки заданий", "error"));
        console.log(tasksResult);
    }

    return (
        <>
            <Head>
                <title>Мои задания | CyberPay</title>
            </Head>

            <AccountPageWrapper navbarList={employeeAccountNavbarList}>
                <Breadcrumbs
                    list={[
                        { text: "Кабинет исполнителя", url: RoutesCreator.getProfileRoute() },
                        { text: "Мои задания", url: RoutesCreator.getEmployeeTasksRoute() },
                    ]}
                />

                <h2 className={styles.pageTitle}>
                    Мои задания <span>{tasksPagination.count}</span>
                </h2>

                <StateSwitcher
                    keyText={"TaskState__"}
                    list={Object.entries(TaskStates).map(([state, text]) => {
                        return { state: state as TaskStateEnum, text };
                    })}
                    onSelectItem={(item) => setSelectedTaskState(item && item.state)}
                />

                <Table className={[styles.table, styles.tasksTable].join(" ")}>
                    <div className={styles.tableLine}>
                        <span>Название</span>
                        <span>Информация</span>
                        <span className={styles.centerText}>Компания</span>
                    </div>

                    {(tasksPagination.results.length &&
                        tasksPagination.results.map((task) => (
                            <a
                                href={RoutesCreator.getEmployeeTaskRoute(task.id, Number(task.company_id))}
                                className={styles.tableLine}
                                key={"tasksTable__item__" + task.id}
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

                                <div>{task.company}</div>
                            </a>
                        ))) || <div className={styles.tableLine}>Пока нет заданий</div>}
                </Table>

                <PaginationControl
                    itemsCount={tasksPagination.count}
                    onPageSelected={(page) => setSelectedTasksPaginationPage(page - 1)}
                />
            </AccountPageWrapper>
        </>
    );
};

EmployeeAllTasksPage.getInitialProps = StoreWrapper.getInitialPageProps<EmployeeAllTasksPageProps>(
    { notAuthenticatedRedirect: "/" },
    () => async (context) => {
        const tasksResult = await TaskAPI.getAllTasksByEmployee(
            { limit: DEFAULT_PAGINATION_LIMIT, offset: 0 },
            context.req
        );

        if (tasksResult.status === 200) return { tasks: tasksResult.data };
        return { tasks: defaultPagination };
    }
);

type EmployeeAllTasksPageProps = { tasks: TaskAPIGetAllTasksByEmployeeResponseData };

export default EmployeeAllTasksPage;
