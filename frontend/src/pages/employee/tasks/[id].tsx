import type { NextPage } from "next";
import { employeeAccountNavbarList } from "constants/navbarLists";
import React, { useState } from "react";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { TaskAPI, TaskAPIGetTaskByEmployeeResponseData } from "api/TaskAPI";
import { TaskStateEnum, TaskStates } from "types/Task";
import { PrettyUtils } from "utils/PrettyUtils";
import { Card } from "components/shared/Card";
import { DocumentsTable } from "components/shared/DocumentsTable";
import styles from "styles/pages/employee/tasks/EmployeeTaskPage.module.scss";
import Head from "next/head";
import { Button } from "components/shared/Button";
import { useRouter } from "next/dist/client/router";
import { useDispatch } from "react-redux";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { PopupActionCreator } from "store/actionCreators/PopupActionCreator";
import { PopupTypeEnum } from "enums/PopupTypeEnum";
import { OTPCodePopupFormData } from "components/popups/OTPCodePopup";
import { Breadcrumbs } from "components/shared/Breadcrumbs";
import { RoutesCreator } from "utils/RoutesCreator";
import { StoreWrapper } from "utils/StoreWrapper";

const EmployeeTaskPage: NextPage<EmployeeTaskPageProps> = (props: EmployeeTaskPageProps) => {
    const [taskData, setTaskData] = useState(props.task);

    const router = useRouter();
    const dispatch = useDispatch();

    async function changeState() {
        const taskResult = await TaskAPI.changeTaskStateByEmployee({
            task_id: Number(router.query.id),
            company_id: Number(router.query.company_id),
        });

        if (taskResult.status === 200) return setTaskData(taskResult.data);

        dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
        console.log(taskResult);
    }

    async function confirmCloseDocument(code: string) {
        const taskResult = await TaskAPI.confirmCloseDocumentByEmployee(Number(router.query.id), {
            company_id: Number(router.query.company_id),
            code,
        });

        if (taskResult.status === 200) {
            dispatch(PopupActionCreator.closePopup());
            return location.reload();
        }

        dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
        console.log(taskResult);
    }

    function confirmCloseDocumentOpenCodePopup() {
        dispatch(
            PopupActionCreator.openPopup(PopupTypeEnum.OTPCode, {
                onSubmit: ({ code }: OTPCodePopupFormData) => confirmCloseDocument(code),
            })
        );
    }

    return (
        <>
            <Head>
                <title>Задание {taskData.title} | CyberPay</title>
            </Head>

            <AccountPageWrapper navbarList={employeeAccountNavbarList}>
                <Breadcrumbs
                    list={[
                        { text: "Кабинет исполнителя", url: RoutesCreator.getProfileRoute() },
                        { text: "Мои задания", url: RoutesCreator.getEmployeeTasksRoute() },
                        {
                            text: taskData.title,
                            url: RoutesCreator.getEmployeeTaskRoute(taskData.id, Number(router.query.company_id)),
                        },
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

                        {taskData.state === TaskStateEnum.ISSUED && (
                            <Button className={styles.actionButton} onClick={changeState}>
                                Приступить
                            </Button>
                        )}

                        {taskData.state === TaskStateEnum.STARTED && (
                            <Button className={styles.actionButton} onClick={changeState}>
                                Отправить на проверку
                            </Button>
                        )}

                        {taskData.state === TaskStateEnum.CLOSED && taskData.is_completed && !taskData.is_paid && (
                            <Button className={styles.actionButton} onClick={confirmCloseDocumentOpenCodePopup}>
                                Подписать закрывающий документ
                            </Button>
                        )}
                    </Card>

                    <DocumentsTable tableTitle="Документы задания" documents={taskData.documents} />
                </div>
            </AccountPageWrapper>
        </>
    );
};

EmployeeTaskPage.getInitialProps = StoreWrapper.getInitialPageProps<EmployeeTaskPageProps>(
    { notAuthenticatedRedirect: "/", hasQueryParams: { params: ["id", "company_id"], redirectLocation: "/" } },
    () => async (context) => {
        const taskResult = await TaskAPI.getTaskByEmployee(
            Number(context.query.id),
            { company_id: Number(context.query.company_id) },
            context.req
        );

        if (taskResult.status !== 200) {
            context.res?.writeHead(302, { Location: "/" });
            context.res?.end();
            return;
        }

        return { task: taskResult.data };
    }
);

type EmployeeTaskPageProps = { task: TaskAPIGetTaskByEmployeeResponseData };

export default EmployeeTaskPage;
