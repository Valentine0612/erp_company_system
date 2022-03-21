import type { NextPage } from "next";
import { managersAccountNavbarList } from "constants/navbarLists";
import React from "react";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { CompanyAPI, CompanyAPIGetCompanyEmployeeByIdData } from "api/CompanyAPI";
import { Card, Avatar, Button, Input, PatternInput, Table, Breadcrumbs, DocumentsTable } from "components/shared";
import { PrettyUtils } from "utils/PrettyUtils";
import styles from "styles/pages/manager/employee/ManagerEmployeePage.module.scss";
import { UserStateEnum, UserStates } from "enums/UserStateEnum";
import { useDispatch } from "react-redux";
import { PopupActionCreator } from "store/actionCreators/PopupActionCreator";
import { PopupTypeEnum } from "enums/PopupTypeEnum";
import { CommentForm, CommentFormOnSubmitData } from "components/forms/CommentForm";
import { UserAPI } from "api/UserAPI";
import { OTPCodePopupFormData } from "components/popups/OTPCodePopup";
import { CreateContractStateByManagerEnum } from "enums/CreateContractStateByManagerEnum";
import { ContractAPI } from "api/ContractAPI";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { OccupationTypeEnum } from "enums/OccupationTypeEnum";
import Head from "next/head";
import { RoutesCreator } from "utils/RoutesCreator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import { StoreWrapper } from "utils/StoreWrapper";

const ManagerEmployeePage: NextPage<ManagerEmployeePageProps> = (props: ManagerEmployeePageProps) => {
    const dispatch = useDispatch();

    async function createComment(data: CommentFormOnSubmitData) {
        const result = await UserAPI.createUserComment(data, props.employee.id);

        if (result.status === 201) return location.reload();

        dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
        console.log(result);
    }

    async function deleteComment(commentID: number) {
        const result = await UserAPI.deleteUserComment(commentID);

        if (result.status === 204) return location.reload();

        dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
        console.log(result);
    }

    async function confirmDocuments(state: CreateContractStateByManagerEnum, data: OTPCodePopupFormData) {
        const result = await ContractAPI.createContractWithUserByManger({ ...data, state }, props.employee.id);

        if (result.status === 202 || result.status === 200) return location.reload();

        dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
        console.log(result);
    }

    async function previewDocument() {
        const result = await CompanyAPI.previewContractWithUser(props.employee.id);

        if (result.status !== 200) {
            dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
            return console.log(result);
        }

        const contract = new Blob([result.data], { type: "application/pdf" });
        const contractURL = URL.createObjectURL(contract);
        window.open(contractURL, "_blank");
        // dispatch(PopupActionCreator.openPopup(PopupTypeEnum.PDFPreview, { file: contractURL }));
    }

    function confirmButtonOnClick(state: CreateContractStateByManagerEnum) {
        dispatch(
            PopupActionCreator.openPopup(PopupTypeEnum.OTPCode, {
                onSubmit: (data: OTPCodePopupFormData) => confirmDocuments(state, data),
            })
        );
    }

    function changeUserAboutOnClick() {
        dispatch(
            PopupActionCreator.openChangeCompanyUserAboutPopup({
                userID: props.employee.id,
                username: PrettyUtils.getUserFullName(props.employee),
                defaultAbout: props.employee.company.about,
            })
        );
    }

    console.log(props.employee);

    return (
        <>
            <Head>
                <title>Исполнитель {PrettyUtils.getUserFullName(props.employee)} | CyberPay</title>
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
                    ]}
                />

                <div className={styles.upperBlock}>
                    <div className={styles.linkBlock}>
                        <span>Данные {PrettyUtils.getUserFullName(props.employee)}</span>
                        <a href={RoutesCreator.getManagerEmployeeTasksRoute(props.employee.id)}>Задания</a>
                    </div>

                    <div className={styles.stateBlock}>{UserStates[props.employee.company.state]}</div>
                </div>

                <div className={styles.mainBlock}>
                    <Card className={styles.userCard}>
                        <div className={styles.userInfoBlock}>
                            <Avatar src={props.employee.avatar} alt={props.employee.email} className={styles.avatar} />

                            <div className={styles.info}>
                                <h2 className={styles.name}>{PrettyUtils.getUserFullName(props.employee)}</h2>
                                <div>{PrettyUtils.getFormattedPhone(props.employee.phone)}</div>
                                <div className={styles.email}>{props.employee.email}</div>
                            </div>
                        </div>

                        <div className={styles.descriptionBlock}>
                            <span>{props.employee.company.about || "Нет описания"}</span>
                            <FontAwesomeIcon
                                icon={faPen}
                                className={styles.descriptionBlock__change}
                                onClick={changeUserAboutOnClick}
                            />
                        </div>

                        <div className={styles.commentsBlock}>
                            {(props.employee.company.comments.length && (
                                <>
                                    <h3 className={styles.employeeCommentsTitle}>Комментарии:</h3>

                                    <Table className={styles.employeeCommentsTable} withoutHeader>
                                        {props.employee.company.comments.map((comment, index) => (
                                            <div key={"employee_comment__" + index} className={styles.employeeComment}>
                                                <span>{comment.body}</span>
                                                <FontAwesomeIcon
                                                    icon={faXmark}
                                                    className={styles.employeeComment__delete}
                                                    onClick={() => deleteComment(comment.id)}
                                                />
                                            </div>
                                        ))}
                                    </Table>
                                </>
                            )) ||
                                undefined}

                            <CommentForm onSubmit={createComment} />
                        </div>
                    </Card>

                    <Card className={styles.employeeDataCard}>
                        <h3>Данные пользователя</h3>

                        <Input
                            placeholder="Фамилия"
                            defaultValue={props.employee.surname}
                            disabled
                            wrapperClassName={styles.formElement}
                        />
                        <Input
                            placeholder="Имя"
                            defaultValue={props.employee.name}
                            disabled
                            wrapperClassName={styles.formElement}
                        />
                        <Input
                            placeholder="Отчество"
                            defaultValue={props.employee.patronymic}
                            disabled
                            wrapperClassName={styles.formElement}
                        />

                        {(props.employee.profile.type === OccupationTypeEnum.FL ||
                            props.employee.profile.type === OccupationTypeEnum.SZ) && (
                            <PatternInput
                                pattern="____ ______"
                                placeholder="Серия и номер паспорта"
                                defaultValue={props.employee.profile.passport.replaceAll(/\D/g, "")}
                                disabled
                                wrapperClassName={styles.formElement}
                            />
                        )}

                        {(props.employee.profile.type === OccupationTypeEnum.FL ||
                            props.employee.profile.type === OccupationTypeEnum.SZ) && (
                            <PatternInput
                                pattern="__.__.____"
                                placeholder="Дата рождения"
                                defaultValue={props.employee.profile.dob.split("-").reverse().join("")}
                                disabled
                                wrapperClassName={styles.formElement}
                            />
                        )}

                        {(props.employee.profile.type === OccupationTypeEnum.FL ||
                            props.employee.profile.type === OccupationTypeEnum.SZ) && (
                            <Input
                                placeholder="Место рождения"
                                defaultValue={props.employee.profile.pob}
                                disabled
                                wrapperClassName={styles.formElement}
                            />
                        )}

                        <Input
                            placeholder="Место регистрации"
                            defaultValue={props.employee.profile.residence}
                            disabled
                            wrapperClassName={styles.formElement}
                        />

                        <Input
                            placeholder="ИНН"
                            defaultValue={props.employee.profile.inn}
                            disabled
                            wrapperClassName={styles.formElement}
                        />

                        {(props.employee.profile.type === OccupationTypeEnum.FL ||
                            props.employee.profile.type === OccupationTypeEnum.SZ) && (
                            <PatternInput
                                pattern="___-___-___ __"
                                placeholder="СНИЛС"
                                defaultValue={props.employee.profile.snils.replaceAll(/\D/g, "")}
                                disabled
                                wrapperClassName={styles.formElement}
                            />
                        )}

                        {props.employee.profile.type === OccupationTypeEnum.RIG && (
                            <Input
                                placeholder="Гражданство"
                                defaultValue={props.employee.profile.citizenship}
                                disabled
                                wrapperClassName={styles.formElement}
                            />
                        )}

                        {props.employee.profile.type === OccupationTypeEnum.IP && (
                            <Input
                                maxLength={15}
                                placeholder="ОГРНИП"
                                defaultValue={props.employee.profile.ogrnip}
                                disabled
                                wrapperClassName={styles.formElement}
                            />
                        )}

                        {props.employee.company.state === UserStateEnum.CHECK && (
                            <>
                                <Button className={styles.formElement} onClick={previewDocument}>
                                    Предпросмотр договора
                                </Button>

                                <div className={styles.buttonsBlock}>
                                    <Button
                                        styleType="red"
                                        onClick={() => confirmButtonOnClick(CreateContractStateByManagerEnum.DENY)}
                                    >
                                        Отклонить
                                    </Button>

                                    <Button
                                        onClick={() => confirmButtonOnClick(CreateContractStateByManagerEnum.ACCEPT)}
                                    >
                                        Подписать
                                    </Button>
                                </div>
                            </>
                        )}
                    </Card>
                </div>

                <DocumentsTable
                    tableTitle={"Документы"}
                    documents={[...props.employee.profile.documents, ...props.employee.company.documents]}
                />
            </AccountPageWrapper>
        </>
    );
};

ManagerEmployeePage.getInitialProps = StoreWrapper.getInitialPageProps<ManagerEmployeePageProps>(
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

        return { employee: employeeResult.data };
    }
);

type ManagerEmployeePageProps = { employee: CompanyAPIGetCompanyEmployeeByIdData };

export default ManagerEmployeePage;
