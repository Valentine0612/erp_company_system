import { CompanyAPI } from "api/CompanyAPI";
import { Breadcrumbs, Button, Card } from "components/shared";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { staffAccountNavbarList } from "constants/navbarLists";
import type { NextPage } from "next";
import Head from "next/head";
import { Company } from "types/Company";
import { RoutesCreator } from "utils/RoutesCreator";
import styles from "styles/pages/staff/company/[id]/StaffCompanyPage.module.scss";
import { useDispatch } from "react-redux";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { StoreWrapper } from "utils/StoreWrapper";

const StaffCompanyPage: NextPage<StaffCompanyPageProps> = (props: StaffCompanyPageProps) => {
    const dispatch = useDispatch();

    async function deleteCompanyOnClickHandler() {
        const result = await CompanyAPI.deleteCompany(props.company.id);

        if (result.status === 204) return location.assign(RoutesCreator.getStaffRoute());

        dispatch(AlertionActionCreator.createAlerion("Произошла ошибка!", "error"));
        console.log(result);
    }

    async function editCompanyOnClickHandler() {
        location.assign(RoutesCreator.getStaffEditCompanyPageRoute(props.company.id));
    }

    return (
        <>
            <Head>
                <title>Задание {props.company.full_name} | CyberPay</title>
            </Head>

            <AccountPageWrapper navbarList={staffAccountNavbarList}>
                <Breadcrumbs
                    list={[
                        { text: "Кабинет администратора", url: RoutesCreator.getStaffRoute() },
                        { text: "Компании", url: RoutesCreator.getStaffRoute() },
                        {
                            text: props.company.full_name,
                            url: RoutesCreator.getStaffCompanyPageRoute(props.company.id),
                        },
                    ]}
                />

                <Card>
                    <h3 className={styles.title}>{props.company.full_name}</h3>

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

                    <div className={styles.buttonsBlock}>
                        <Button styleType="white" onClick={editCompanyOnClickHandler}>
                            Редактировать
                        </Button>
                        <Button styleType="red" onClick={deleteCompanyOnClickHandler}>
                            Удалить
                        </Button>
                    </div>
                </Card>
            </AccountPageWrapper>
        </>
    );
};

StaffCompanyPage.getInitialProps = StoreWrapper.getInitialPageProps<StaffCompanyPageProps>(
    {
        notAuthenticatedRedirect: "/",
        storeRedirect: {
            redirect: (store) => !store.user.userInfo?.staff,
            redirectLocation: "/",
        },
        hasQueryParams: { params: ["id"], redirectLocation: "/" },
    },
    () => async (context) => {
        const companyResult = await CompanyAPI.getCompanyById(Number(context.query.id), context.req);

        if (companyResult.status !== 200) {
            context.res?.writeHead(302, { Location: "/" });
            context.res?.end();
            return;
        }

        return { company: companyResult.data };
    }
);

type StaffCompanyPageProps = { company: Company };

export default StaffCompanyPage;
