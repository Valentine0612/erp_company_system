import type { NextPage } from "next";
import React from "react";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { managersAccountNavbarList } from "constants/navbarLists";
import styles from "styles/pages/manager/ManagerCompanyPage.module.scss";
import Head from "next/head";
import { RoutesCreator } from "utils/RoutesCreator";
import { StoreWrapper } from "utils/StoreWrapper";
import { Card, Breadcrumbs } from "components/shared";
import { Company } from "types/Company";
import { CompanyAPI } from "api/CompanyAPI";
import moment from "moment";
import { LOCAL_DATE_FORMAT } from "constants/defaults";

const ManagerCompanyPage: NextPage<ManagerCompanyPageProps> = (props) => {
    return (
        <>
            <Head>
                <title>Моя компания</title>
            </Head>

            <AccountPageWrapper navbarList={managersAccountNavbarList}>
                <Breadcrumbs
                    list={[
                        { text: "Кабинет менеджера", url: RoutesCreator.getManagerRoute() },
                        { text: "Моя компания", url: RoutesCreator.getManagerCompanyRoute() },
                    ]}
                />

                <h2 className={styles.pageTitle}>{props.company.full_name}</h2>

                <Card>
                    <p className={styles.infoElement}>
                        <span>Короткое название:</span> {props.company.short_name}
                    </p>
                    <p className={styles.infoElement}>
                        <span>Адрес:</span> {props.company.address}
                    </p>
                    <p className={styles.infoElement}>
                        <span>Email:</span> {props.company.email}
                    </p>
                    <p className={styles.infoElement}>
                        <span>Телефон:</span> {props.company.phone}
                    </p>
                    <p className={styles.infoElement}>
                        <span>ИНН:</span> {props.company.inn}
                    </p>
                    <p className={styles.infoElement}>
                        <span>ОГРН:</span> {props.company.ogrn}
                    </p>
                    <p className={styles.infoElement}>
                        <span>ОКПО:</span> {props.company.okpo}
                    </p>
                    <p className={styles.infoElement}>
                        <span>РС:</span> {props.company.rs}
                    </p>
                    <p className={styles.infoElement}>
                        <span>КС:</span> {props.company.ks}
                    </p>
                    <p className={styles.infoElement}>
                        <span>Название банка:</span> {props.company.bank_info}
                    </p>
                    <p className={styles.infoElement}>
                        <span>БИК:</span> {props.company.bik}
                    </p>

                    {props.company.kpp && (
                        <p className={styles.infoElement}>
                            <span>КПП:</span> {props.company.kpp}
                        </p>
                    )}

                    <p className={styles.infoElement}>
                        <span>Текущий баланс:</span> {props.company.amount}
                    </p>
                    <p className={styles.infoElement}>
                        <span>Замороженные средства компании:</span> {props.company.amount_on_hold}
                    </p>

                    <p className={styles.infoElement}>
                        <span>Количество активных работников:</span> {props.company.receipts.active_workers}
                    </p>
                    <p className={styles.infoElement}>
                        <span>Начало работы в системе:</span>{" "}
                        {moment(props.company.receipts.from_period).format(LOCAL_DATE_FORMAT)}
                    </p>
                    <p className={styles.infoElement}>
                        <span>Конец подписки:</span>{" "}
                        {moment(props.company.receipts.to_period).format(LOCAL_DATE_FORMAT)}
                    </p>
                </Card>
            </AccountPageWrapper>
        </>
    );
};

ManagerCompanyPage.getInitialProps = StoreWrapper.getInitialPageProps<ManagerCompanyPageProps>(
    {
        notAuthenticatedRedirect: "/",
        storeRedirect: {
            redirect: (store) => !store.user.userInfo?.manager,
            redirectLocation: "/",
        },
    },
    () => async (context) => {
        const companyResult = await CompanyAPI.getCompanyInfoByManager(context.req);

        if (companyResult.status !== 200) {
            context.res?.writeHead(302, { Location: "/" });
            context.res?.end();
            return;
        }

        return { company: companyResult.data };
    }
);

type ManagerCompanyPageProps = { company: Company };

export default ManagerCompanyPage;
