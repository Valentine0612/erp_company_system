import type { NextPage } from "next";
import React from "react";
import { useSelector } from "react-redux";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { employeeAccountNavbarList } from "constants/navbarLists";
import { IState } from "store";
import { PrettyUtils } from "utils/PrettyUtils";
import styles from "styles/pages/employee/EmployeePage.module.scss";
import { User } from "types/User";
import { Card, Avatar, Input, PatternInput, Breadcrumbs, DocumentsTable } from "components/shared/";
import { OccupationTypeEnum } from "enums/OccupationTypeEnum";
import Head from "next/head";
import { RoutesCreator } from "utils/RoutesCreator";
import { StoreWrapper } from "utils/StoreWrapper";

const EmployeePage: NextPage<undefined> = () => {
    const user = useSelector((state: IState) => state.user.userInfo as User);

    return (
        <>
            <Head>
                <title>Мои документы и данные | CyberPay</title>
            </Head>

            <AccountPageWrapper navbarList={employeeAccountNavbarList}>
                <Breadcrumbs
                    list={[
                        { text: "Кабинет исполнителя", url: RoutesCreator.getProfileRoute() },
                        { text: "Мои документы и данные", url: RoutesCreator.getEmployeeInfoRoute() },
                    ]}
                />

                <div className={styles.upperBlock}>
                    <h2 className={styles.pageTitle}>Мои документы и данные</h2>
                </div>

                <div className={styles.mainBlock}>
                    <Card className={styles.userCard}>
                        <div className={styles.userInfoBlock}>
                            <Avatar src={user.avatar} alt={user.email} className={styles.avatar} />

                            <div className={styles.info}>
                                <h2 className={styles.name}>{PrettyUtils.getUserFullName(user)}</h2>
                                <div>{PrettyUtils.getFormattedPhone(user.phone)}</div>
                                <div className={styles.email}>{user.email}</div>
                            </div>
                        </div>
                    </Card>

                    <Card className={styles.employeeDataCard}>
                        <h3>Данные пользователя</h3>

                        <Input
                            placeholder="Фамилия"
                            defaultValue={user.surname}
                            disabled
                            wrapperClassName={styles.formElement}
                        />
                        <Input
                            placeholder="Имя"
                            defaultValue={user.name}
                            disabled
                            wrapperClassName={styles.formElement}
                        />
                        <Input
                            placeholder="Отчество"
                            defaultValue={user.patronymic}
                            disabled
                            wrapperClassName={styles.formElement}
                        />

                        {(user.profile.type === OccupationTypeEnum.FL ||
                            user.profile.type === OccupationTypeEnum.SZ) && (
                            <PatternInput
                                pattern="____ ______"
                                placeholder="Серия и номер паспорта"
                                defaultValue={user.profile.passport.replaceAll(/\D/g, "")}
                                disabled
                                wrapperClassName={styles.formElement}
                            />
                        )}

                        {(user.profile.type === OccupationTypeEnum.FL ||
                            user.profile.type === OccupationTypeEnum.SZ) && (
                            <PatternInput
                                pattern="__.__.____"
                                placeholder="Дата рождения"
                                defaultValue={user.profile.dob.split("-").reverse().join("")}
                                disabled
                                wrapperClassName={styles.formElement}
                            />
                        )}

                        {(user.profile.type === OccupationTypeEnum.FL ||
                            user.profile.type === OccupationTypeEnum.SZ) && (
                            <Input
                                placeholder="Место рождения"
                                defaultValue={user.profile.pob}
                                disabled
                                wrapperClassName={styles.formElement}
                            />
                        )}

                        <Input
                            placeholder="Место регистрации"
                            defaultValue={user.profile.residence}
                            disabled
                            wrapperClassName={styles.formElement}
                        />

                        <Input
                            placeholder="ИНН"
                            defaultValue={user.profile.inn}
                            disabled
                            wrapperClassName={styles.formElement}
                        />

                        {(user.profile.type === OccupationTypeEnum.FL ||
                            user.profile.type === OccupationTypeEnum.SZ) && (
                            <PatternInput
                                pattern="___-___-___ __"
                                placeholder="СНИЛС"
                                defaultValue={user.profile.snils.replaceAll(/\D/g, "")}
                                disabled
                                wrapperClassName={styles.formElement}
                            />
                        )}

                        {user.profile.type === OccupationTypeEnum.RIG && (
                            <Input
                                placeholder="Гражданство"
                                defaultValue={user.profile.citizenship}
                                disabled
                                wrapperClassName={styles.formElement}
                            />
                        )}

                        {user.profile.type === OccupationTypeEnum.IP && (
                            <Input
                                maxLength={15}
                                placeholder="ОГРНИП"
                                defaultValue={user.profile.ogrnip}
                                disabled
                                wrapperClassName={styles.formElement}
                            />
                        )}
                    </Card>
                </div>

                <DocumentsTable tableTitle={"Документы"} documents={user.profile.documents} />
            </AccountPageWrapper>
        </>
    );
};

EmployeePage.getInitialProps = StoreWrapper.getInitialPageProps({ notAuthenticatedRedirect: "/" });

export default EmployeePage;
