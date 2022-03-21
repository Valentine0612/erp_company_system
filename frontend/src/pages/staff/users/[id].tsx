import type { NextPage } from "next";
import { managersAccountNavbarList } from "constants/navbarLists";
import React from "react";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { PrettyUtils } from "utils/PrettyUtils";
import styles from "styles/pages/staff/users/StaffUserDetailsPage.module.scss";
import { useDispatch } from "react-redux";
import { OccupationTypeEnum } from "enums/OccupationTypeEnum";
import { UserAPI, UserAPIGetgetUserWithIdByStaffData } from "api/UserAPI";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { RoutesCreator } from "utils/RoutesCreator";
import Head from "next/head";
import { DocumentsTable, Card, Avatar, Button, Input, PatternInput, Breadcrumbs } from "components/shared";
import { StoreWrapper } from "utils/StoreWrapper";

const StaffUserDetailsPage: NextPage<StaffUserDetailsPageProps> = (props: StaffUserDetailsPageProps) => {
    const dispatch = useDispatch();

    async function verifyButtonOnClick() {
        const result = await UserAPI.verifyUser(props.user.id);
        if (result.status === 205) return location.replace(RoutesCreator.getStaffUsersListRoute());
        dispatch(AlertionActionCreator.createAlerion("Что-то пошло не так!", "error"));
    }

    return (
        <>
            <Head>
                <title>Пользователь {PrettyUtils.getUserFullName(props.user)} | CyberPay</title>
            </Head>

            <AccountPageWrapper navbarList={managersAccountNavbarList}>
                <Breadcrumbs
                    list={[
                        { text: "Кабинет администратора", url: RoutesCreator.getStaffRoute() },
                        { text: "Пользователи", url: RoutesCreator.getStaffUsersListRoute() },
                        {
                            text: PrettyUtils.getUserFullName(props.user),
                            url: RoutesCreator.getStaffUserDetailsRoute(props.user.id),
                        },
                    ]}
                />

                <h2>Пользователь {PrettyUtils.getUserFullName(props.user)}</h2>

                <div className={styles.mainBlock}>
                    <Card className={styles.userCard}>
                        <div className={styles.userInfoBlock}>
                            <Avatar src={props.user.avatar} alt={props.user.email} className={styles.avatar} />

                            <div className={styles.info}>
                                <h2 className={styles.name}>{PrettyUtils.getUserFullName(props.user)}</h2>
                                <div>{PrettyUtils.getFormattedPhone(props.user.phone)}</div>
                                <div className={styles.email}>{props.user.email}</div>
                            </div>
                        </div>
                    </Card>

                    <Card className={styles.employeeDataCard}>
                        <h3>Данные пользователя</h3>

                        <Input
                            placeholder="Фамилия"
                            defaultValue={props.user.surname}
                            disabled
                            wrapperClassName={styles.formElement}
                        />
                        <Input
                            placeholder="Имя"
                            defaultValue={props.user.name}
                            disabled
                            wrapperClassName={styles.formElement}
                        />
                        <Input
                            placeholder="Отчество"
                            defaultValue={props.user.patronymic}
                            disabled
                            wrapperClassName={styles.formElement}
                        />

                        {(props.user.profile.type === OccupationTypeEnum.FL ||
                            props.user.profile.type === OccupationTypeEnum.SZ) && (
                            <PatternInput
                                pattern="____ ______"
                                placeholder="Серия и номер паспорта"
                                defaultValue={props.user.profile.passport.replaceAll(/\D/g, "")}
                                disabled
                                wrapperClassName={styles.formElement}
                            />
                        )}

                        {(props.user.profile.type === OccupationTypeEnum.FL ||
                            props.user.profile.type === OccupationTypeEnum.SZ) && (
                            <PatternInput
                                pattern="__.__.____"
                                placeholder="Дата рождения"
                                defaultValue={props.user.profile.dob.split("-").reverse().join("")}
                                disabled
                                wrapperClassName={styles.formElement}
                            />
                        )}

                        {(props.user.profile.type === OccupationTypeEnum.FL ||
                            props.user.profile.type === OccupationTypeEnum.SZ) && (
                            <Input
                                placeholder="Место рождения"
                                defaultValue={props.user.profile.pob}
                                disabled
                                wrapperClassName={styles.formElement}
                            />
                        )}

                        <Input
                            placeholder="Место регистрации"
                            defaultValue={props.user.profile.residence}
                            disabled
                            wrapperClassName={styles.formElement}
                        />

                        <Input
                            placeholder="ИНН"
                            defaultValue={props.user.profile.inn}
                            disabled
                            wrapperClassName={styles.formElement}
                        />

                        {(props.user.profile.type === OccupationTypeEnum.FL ||
                            props.user.profile.type === OccupationTypeEnum.SZ) && (
                            <PatternInput
                                pattern="___-___-___ __"
                                placeholder="СНИЛС"
                                defaultValue={props.user.profile.snils.replaceAll(/\D/g, "")}
                                disabled
                                wrapperClassName={styles.formElement}
                            />
                        )}

                        {props.user.profile.type === OccupationTypeEnum.RIG && (
                            <Input
                                placeholder="Гражданство"
                                defaultValue={props.user.profile.citizenship}
                                disabled
                                wrapperClassName={styles.formElement}
                            />
                        )}

                        {props.user.profile.type === OccupationTypeEnum.IP && (
                            <Input
                                maxLength={15}
                                placeholder="ОГРНИП"
                                defaultValue={props.user.profile.ogrnip}
                                disabled
                                wrapperClassName={styles.formElement}
                            />
                        )}

                        {!props.user.verified && <Button onClick={verifyButtonOnClick}>Подтвердить</Button>}
                    </Card>
                </div>

                <DocumentsTable tableTitle={"Документы"} documents={props.user.profile.documents} />
            </AccountPageWrapper>
        </>
    );
};

StaffUserDetailsPage.getInitialProps = StoreWrapper.getInitialPageProps<StaffUserDetailsPageProps>(
    {
        notAuthenticatedRedirect: "/",
        hasQueryParams: { params: ["id"], redirectLocation: "/" },
        storeRedirect: {
            redirect: (state) => !state.user.userInfo?.staff,
            redirectLocation: "/",
        },
    },
    () => async (context) => {
        const employeeResult = await UserAPI.getUserWithIdByStaff(Number(context.query.id), context.req);

        if (employeeResult.status !== 200) {
            context.res?.writeHead(302, { Location: "/" });
            context.res?.end();
            return;
        }

        return { user: employeeResult.data };
    }
);

type StaffUserDetailsPageProps = { user: UserAPIGetgetUserWithIdByStaffData };

export default StaffUserDetailsPage;
