import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { employeeAccountNavbarList } from "constants/navbarLists";
import { IState } from "store";
import styles from "styles/pages/employee/companies/EmployeeCompanyPage.module.scss";
import { Table } from "components/shared/Table";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";
import { Button } from "components/shared/Button";
import { PopupActionCreator } from "store/actionCreators/PopupActionCreator";
import { PopupTypeEnum } from "enums/PopupTypeEnum";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { UserStateEnum, UserStates } from "enums/UserStateEnum";
import { ConfirmContractStateByEmployeeEnum } from "enums/ConfirmContractStateByEmployeeEnum";
import { ContractAPI } from "api/ContractAPI";
import { OTPCodePopupFormData } from "components/popups/OTPCodePopup";
import Head from "next/head";
import { TaskAPI, TaskAPIGetCompanyTasksByEmployeeResponseData } from "api/TaskAPI";
import { DEFAULT_PAGINATION_LIMIT } from "types/Pagination";
import { PrettyUtils } from "utils/PrettyUtils";
import { TaskStates } from "types/Task";
import { PaginationControl } from "components/shared/PaginationControl";
import { Breadcrumbs } from "components/shared/Breadcrumbs";
import { RoutesCreator } from "utils/RoutesCreator";
import { StoreWrapper } from "utils/StoreWrapper";
import { DocumentsTable } from "components/shared";
import { CompanyDocument } from "types/Company";

const EmployeeCompanyPage: NextPage<EmployeeCompanyPageProps> = (props) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const companyInfo = useSelector((state: IState) =>
        state.user.userInfo?.company.find((company) => company.company_id === Number(router.query.id))
    );

    const [selectedTasksPaginationPage, setSelectedTasksPaginationPage] = useState(0);
    const [tasksPagination, setTasksPagination] = useState(props.tasks);

    const user = useSelector((store: IState) => store.user.userInfo);

    useEffect(() => {
        updateTasksPagination();
    }, [selectedTasksPaginationPage]);

    async function confirmDocuments(state: ConfirmContractStateByEmployeeEnum, data: OTPCodePopupFormData) {
        const result = await ContractAPI.confirmContractByEmployee({
            ...data,
            state,
            company: companyInfo?.company_id as number,
        });

        if (result.status === 200) return location.reload();

        dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
        console.log(result);
    }

    function confirmButtonOnClick(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        state: ConfirmContractStateByEmployeeEnum
    ) {
        event.stopPropagation();
        dispatch(
            PopupActionCreator.openPopup(PopupTypeEnum.OTPCode, {
                onSubmit: (data: OTPCodePopupFormData) => confirmDocuments(state, data),
            })
        );
    }

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

        const tasksResult = await TaskAPI.getCompanyTasksByEmployee({
            company_id: Number(router.query.id),
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
                <title>{companyInfo?.company} | CyberPay</title>
            </Head>

            <AccountPageWrapper navbarList={employeeAccountNavbarList}>
                <Breadcrumbs
                    list={[
                        { text: "Кабинет исполнителя", url: RoutesCreator.getProfileRoute() },
                        { text: "Мои компании", url: RoutesCreator.getEmployeeCompaniesRoute() },
                        {
                            text: companyInfo?.company || "",
                            url: RoutesCreator.getEmployeeCompanyRoute(companyInfo?.company_id || 0),
                        },
                    ]}
                />

                <div className={styles.upperBlock}>
                    <h2 className={styles.pageTitle}>{companyInfo?.company}</h2>
                    <div className={styles.userState}>{(companyInfo && UserStates[companyInfo.state]) || ""}</div>
                </div>

                <DocumentsTable
                    tableTitle={"Документы"}
                    tableClassName={styles.documentsTable}
                    documents={companyInfo?.documents || []}
                    tableLineClassName={styles.documentsTableLine}
                    tableLineInner={
                        (companyInfo?.state === UserStateEnum.WAITING_EMP &&
                            ((document) => (
                                <>
                                    <span className={styles.documentsTitle}>{(document as CompanyDocument).title}</span>
                                    <Button
                                        styleType="red"
                                        className={styles.documentTableButton}
                                        onClick={(event) =>
                                            confirmButtonOnClick(event, ConfirmContractStateByEmployeeEnum.REFUSED)
                                        }
                                    >
                                        Отклонить
                                    </Button>
                                    <Button
                                        className={styles.documentTableButton}
                                        onClick={(event) =>
                                            confirmButtonOnClick(event, ConfirmContractStateByEmployeeEnum.READY)
                                        }
                                    >
                                        Подписать
                                    </Button>
                                </>
                            ))) ||
                        undefined
                    }
                />

                <h4 className={styles.tableTitle}>Задания</h4>

                <Table className={[styles.table, styles.tasksTable].join(" ")}>
                    <div className={styles.tableLine}>
                        <span>Название</span>
                        <span>Информация</span>
                    </div>

                    {(tasksPagination.results.length &&
                        tasksPagination.results.map((task, index) => (
                            <a
                                href={RoutesCreator.getEmployeeTaskRoute(task.id, Number(router.query.id))}
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
                    onPageSelected={(page) => setSelectedTasksPaginationPage(page - 1)}
                />
            </AccountPageWrapper>
        </>
    );
};

EmployeeCompanyPage.getInitialProps = StoreWrapper.getInitialPageProps<EmployeeCompanyPageProps>(
    {
        notAuthenticatedRedirect: "/",
        hasQueryParams: { params: ["id"], redirectLocation: "/" },
        storeRedirect: {
            redirect: (store, context) =>
                !store.user.userInfo?.company.find((company) => company.company_id === Number(context.query.id)),
            redirectLocation: "/",
        },
    },
    () => async (context) => {
        const tasksResult = await TaskAPI.getCompanyTasksByEmployee(
            { company_id: Number(context.query.id), limit: DEFAULT_PAGINATION_LIMIT, offset: 0 },
            context.req
        );

        if (tasksResult.status !== 200) {
            context.res?.writeHead(302, { Location: "/" });
            context.res?.end();
            return;
        }

        return { tasks: tasksResult.data };
    }
);

type EmployeeCompanyPageProps = { tasks: TaskAPIGetCompanyTasksByEmployeeResponseData };

export default EmployeeCompanyPage;
