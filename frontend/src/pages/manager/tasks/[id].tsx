import type { NextPage } from "next";
import { managersAccountNavbarList } from "constants/navbarLists";
import React, { useState } from "react";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { TaskAPI } from "api/TaskAPI";
import { Task, TaskStateEnum, TaskStates } from "types/Task";
import { PrettyUtils } from "utils/PrettyUtils";
import { Card } from "components/shared/Card";
import { DocumentsTable } from "components/shared/DocumentsTable";
import styles from "styles/pages/manager/tasks/ManagerTaskPage.module.scss";
import { Avatar } from "components/shared/Avatar";
import { UserStates } from "enums/UserStateEnum";
import Head from "next/head";
import { useDispatch } from "react-redux";
import { Button } from "components/shared/Button";
import { useRouter } from "next/dist/client/router";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { PopupActionCreator } from "store/actionCreators/PopupActionCreator";
import { PopupTypeEnum } from "enums/PopupTypeEnum";
import { OTPCodePopupFormData } from "components/popups/OTPCodePopup";
import { RoutesCreator } from "utils/RoutesCreator";
import { Breadcrumbs } from "components/shared/Breadcrumbs";
import { StoreWrapper } from "utils/StoreWrapper";

const ManagerTaskPage: NextPage<ManagerTaskPageProps> = (props: ManagerTaskPageProps) => {
    const [taskData, setTaskData] = useState(props.task);

    const router = useRouter();
    const dispatch = useDispatch();

    async function changeState() {
        const taskResult = await TaskAPI.changeTaskStateByManager({
            task_id: Number(router.query.id),
        });

        if (taskResult.status === 200) return setTaskData({ ...taskResult.data, user: props.task.user });

        dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
        console.log(taskResult);
    }

    async function createCloseDocument(code: string) {
        const taskResult = await TaskAPI.createCloseDocumentByManager({
            tasks: [Number(router.query.id)],
            code,
        });

        if (taskResult.status === 200) {
            dispatch(PopupActionCreator.closePopup());
            return location.reload();
        }

        dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
        console.log(taskResult);
    }

    function createCloseDocumentOpenCodePopup() {
        dispatch(
            PopupActionCreator.openPopup(PopupTypeEnum.OTPCode, {
                onSubmit: ({ code }: OTPCodePopupFormData) => createCloseDocument(code),
            })
        );
    }

    async function deleteTask() {
        const result = await TaskAPI.deleteTasksByManager(taskData.id);

        if (result.status === 204) return location.assign(RoutesCreator.getManagerAllTasksRoute());

        dispatch(AlertionActionCreator.createAlerion("Ошибка удаления задания", "error"));
        console.log(result);
    }

    async function editTask() {
        return location.assign(RoutesCreator.getManagerNewTaskRoute({ edit: true, taskId: taskData.id }));
    }

    return (
        <>
            <Head>
                <title>Задание {taskData.title} | CyberPay</title>
            </Head>

            <AccountPageWrapper navbarList={managersAccountNavbarList}>
                <Breadcrumbs
                    list={[
                        { text: "Кабинет менеджера", url: RoutesCreator.getManagerRoute() },
                        { text: "Задания", url: RoutesCreator.getManagerAllTasksRoute() },
                        { text: taskData.title, url: RoutesCreator.getManagerTaskRoute(taskData.id) },
                    ]}
                />

                <div className={styles.pageWrapper}>
                    <Card className={styles.taskInfoCard}>
                        <h3 className={styles.taskName}>{taskData.title}</h3>
                        <p className={styles.taskDescription}>{taskData.description}</p>

                        <p className={styles.taskInfo}>
                            Создано: <span>{PrettyUtils.getFormattedDate(taskData.from_date, true)}</span>
                        </p>
                        <p className={styles.taskInfo}>
                            Выполнить до: <span>{PrettyUtils.getFormattedDate(taskData.to_date, true)}</span>
                        </p>
                        <p className={styles.taskInfo}>
                            Стоимость: <span>{taskData.price}</span>
                        </p>
                        <p className={styles.taskInfo}>
                            Статус: <span>{TaskStates[taskData.state]}</span>
                        </p>
                        <p className={styles.taskInfo}>
                            Закрывающий документ отправлен: <span>{taskData.is_completed ? "Да" : "Нет"}</span>
                        </p>
                        {taskData.status && (
                            <div className={styles.taskInfo}>
                                Статус оплаты: <span>{taskData.status}</span>
                            </div>
                        )}

                        {taskData.state === TaskStateEnum.FINISHED && (
                            <Button className={styles.actionButton} onClick={changeState}>
                                Начать проверку
                            </Button>
                        )}

                        {taskData.state === TaskStateEnum.CHECK && (
                            <Button className={styles.actionButton} onClick={changeState}>
                                Закончить проверку
                            </Button>
                        )}

                        {taskData.state === TaskStateEnum.CLOSED && !taskData.is_completed && (
                            <Button className={styles.actionButton} onClick={createCloseDocumentOpenCodePopup}>
                                Создать закрывающий документ
                            </Button>
                        )}

                        {taskData.state === TaskStateEnum.ISSUED && (
                            <Button className={styles.actionButton} onClick={editTask} styleType="white">
                                Изменить задание
                            </Button>
                        )}

                        {taskData.state === TaskStateEnum.ISSUED && (
                            <Button className={styles.actionButton} onClick={deleteTask} styleType="red">
                                Удалить задание
                            </Button>
                        )}
                    </Card>

                    <div>
                        <div className={styles.additionalInfoBlock}>
                            <h4>Исполнитель:</h4>

                            <Card className={styles.taskEmployeeCard}>
                                <div className={styles.taskEmployee}>
                                    <div className={styles.taskEmployeeInfo}>
                                        <Avatar
                                            src={taskData.user.avatar}
                                            alt={taskData.user.email}
                                            size="small"
                                            className={styles.avatar}
                                        />

                                        <div>
                                            <div className={[styles.taskEmployeeTextInfo, styles.name].join(" ")}>
                                                {PrettyUtils.getUserFullName(taskData.user)}
                                            </div>
                                            <div className={styles.taskEmployeeTextInfo}>{taskData.user.email}</div>
                                            <div className={styles.taskEmployeeTextInfo}>{taskData.user.phone}</div>
                                            <div className={styles.taskEmployeeTextInfo}>
                                                {UserStates[taskData.user.state]}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <DocumentsTable tableTitle="Документы задания" documents={taskData.documents} />
                    </div>
                </div>
            </AccountPageWrapper>
        </>
    );
};

ManagerTaskPage.getInitialProps = StoreWrapper.getInitialPageProps<ManagerTaskPageProps>(
    {
        notAuthenticatedRedirect: "/",
        storeRedirect: {
            redirect: (store) => !store.user.userInfo?.manager,
            redirectLocation: "/",
        },
        hasQueryParams: { params: ["id"], redirectLocation: "/" },
    },
    () => async (context) => {
        const taskResult = await TaskAPI.getTask(Number(context.query.id), context.req);

        if (taskResult.status !== 200) {
            context.res?.writeHead(302, { Location: "/" });
            context.res?.end();
            return;
        }

        return { task: taskResult.data };
    }
);

type ManagerTaskPageProps = { task: Task };

export default ManagerTaskPage;
