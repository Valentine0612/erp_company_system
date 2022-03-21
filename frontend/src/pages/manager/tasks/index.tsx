import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { managersAccountNavbarList } from "constants/navbarLists";
import styles from "styles/pages/manager/tasks/ManagerAllTasksPage.module.scss";
import { Table } from "components/shared/Table";
import { useDispatch } from "react-redux";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import Head from "next/head";
import { TaskAPI, TaskAPIGetAllTasksResponseData } from "api/TaskAPI";
import { defaultPagination, DEFAULT_PAGINATION_LIMIT } from "types/Pagination";
import { PrettyUtils } from "utils/PrettyUtils";
import { TaskState, TaskStateEnum, TaskStates } from "types/Task";
import { PaginationControl } from "components/shared/PaginationControl";
import { Avatar } from "components/shared/Avatar";
import { RoutesCreator } from "utils/RoutesCreator";
import { Breadcrumbs } from "components/shared/Breadcrumbs";
import { StoreWrapper } from "utils/StoreWrapper";
import { StateSwitcher } from "components/shared";

const ManagerAllTasksPage: NextPage<ManagerAllTasksPageProps> = (props) => {
    const [selectedTasksPaginationPage, setSelectedTasksPaginationPage] = useState(0);
    const [tasksPagination, setTasksPagination] = useState(props.tasks);
    const [selectedTaskState, setSelectedTaskState] = useState<TaskState | undefined>(undefined);

    const dispatch = useDispatch();

    useEffect(() => {
        updateTasksPagination();
    }, [selectedTasksPaginationPage, selectedTaskState]);

    async function updateTasksPagination() {
        const tasksResult = await TaskAPI.getAllTasks({
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
                <title>Задания | CyberPay</title>
            </Head>

            <AccountPageWrapper navbarList={managersAccountNavbarList}>
                <Breadcrumbs
                    list={[
                        { text: "Кабинет менеджера", url: RoutesCreator.getManagerRoute() },
                        { text: "Задания", url: RoutesCreator.getManagerAllTasksRoute() },
                    ]}
                />

                <h2 className={styles.pageTitle}>
                    Задания <span>{tasksPagination.count}</span>
                    <button onClick={() => location.assign(RoutesCreator.getManagerNewTaskRoute())}>
                        Создать задание
                    </button>
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
                        <span>Исполнитель</span>
                    </div>

                    {(tasksPagination.results.length &&
                        tasksPagination.results.map((task) => (
                            <a
                                href={RoutesCreator.getManagerTaskRoute(task.id)}
                                className={styles.tableLine}
                                key={"tasksTable__item__" + task.id}
                            >
                                <div>
                                    <h4 className={styles.taskTitle}>{task.title}</h4>
                                    <div className={styles.taskDescription}>{task.description}</div>
                                </div>

                                <div className={styles.taskParameters}>
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

                                <div className={styles.userBlock}>
                                    <Avatar
                                        src={task.user.avatar}
                                        alt={task.user.email}
                                        size="small"
                                        className={styles.avatar}
                                    />
                                    <div>
                                        <div>
                                            <b>{PrettyUtils.getUserFullName(task.user)}</b>
                                        </div>
                                        <div>{task.user.email}</div>
                                        <div>{task.user.phone}</div>
                                        <div>{task.user.inn}</div>
                                    </div>
                                </div>
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

ManagerAllTasksPage.getInitialProps = StoreWrapper.getInitialPageProps<ManagerAllTasksPageProps>(
    {
        notAuthenticatedRedirect: "/",
        storeRedirect: {
            redirect: (store) => !store.user.userInfo?.manager,
            redirectLocation: "/",
        },
    },
    () => async (context) => {
        const tasksResult = await TaskAPI.getAllTasks({ limit: DEFAULT_PAGINATION_LIMIT, offset: 0 }, context.req);
        return { tasks: tasksResult.status === 200 ? tasksResult.data : defaultPagination };
    }
);

type ManagerAllTasksPageProps = { tasks: TaskAPIGetAllTasksResponseData };

export default ManagerAllTasksPage;
