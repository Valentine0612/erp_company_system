import type { NextPage } from "next";
import React from "react";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { employeeAccountNavbarList } from "constants/navbarLists";
import { IState } from "store";
import styles from "styles/pages/employee/companies/EmployeeCompaniesPage.module.scss";
import { Table } from "components/shared/Table";
import { useSelector } from "react-redux";
import { UserStates } from "enums/UserStateEnum";
import Head from "next/head";
import { Breadcrumbs } from "components/shared/Breadcrumbs";
import { RoutesCreator } from "utils/RoutesCreator";
import { StoreWrapper } from "utils/StoreWrapper";
import { SubscibeToCompanyStatusEnum } from "enums/SubscibeToCompanyStatusEnum";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";

const EmployeeCompaniesPage: NextPage = () => {
    const userCompaniesInfo = useSelector((state: IState) => state.user.userInfo?.company);

    return (
        <>
            <Head>
                <title>Мои компании | CyberPay</title>
            </Head>

            <AccountPageWrapper navbarList={employeeAccountNavbarList}>
                <Breadcrumbs
                    list={[
                        { text: "Кабинет исполнителя", url: RoutesCreator.getProfileRoute() },
                        { text: "Мои компании", url: RoutesCreator.getEmployeeCompaniesRoute() },
                    ]}
                />

                <h2 className={styles.pageTitle}>
                    Мои компании <span>{userCompaniesInfo?.length || 0}</span>
                </h2>

                <Table className={styles.table}>
                    <div className={styles.tableLine}>
                        <span>Название</span>
                        <span>Стадия</span>
                    </div>

                    {(userCompaniesInfo?.length &&
                        userCompaniesInfo?.map((company, index) => (
                            <a
                                href={RoutesCreator.getEmployeeCompanyRoute(company.company_id)}
                                className={styles.tableLine}
                                key={"companiesTable__item__" + index}
                            >
                                <div className={styles.nameBlock}>{company.company || ""}</div>
                                <div className={styles.stateBlock}>{UserStates[company.state]}</div>
                            </a>
                        ))) || <div className={styles.tableLine}>Пока нет компаний</div>}
                </Table>
            </AccountPageWrapper>
        </>
    );
};

EmployeeCompaniesPage.getInitialProps = StoreWrapper.getInitialPageProps(
    { notAuthenticatedRedirect: "/" },
    (store) => async (context) => {
        switch (context.query.success_subscribe) {
            case SubscibeToCompanyStatusEnum.success:
                store.dispatch(
                    AlertionActionCreator.createAlerion("Вы успешно зарегистировались в компанию!", "success")
                );
                break;

            case SubscibeToCompanyStatusEnum.error:
                store.dispatch(
                    AlertionActionCreator.createAlerion("Произошла ошибка при регистирации в компании!", "error")
                );
                break;

            case SubscibeToCompanyStatusEnum.unVerified:
                store.dispatch(
                    AlertionActionCreator.createAlerion("Ваш аккаунт еще не подтвержден администратором!", "error")
                );
                break;

            default:
                break;
        }
    }
);

export default EmployeeCompaniesPage;
