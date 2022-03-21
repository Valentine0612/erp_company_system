import { CompanyAPI } from "api/CompanyAPI";
import { Breadcrumbs, Card } from "components/shared";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { staffAccountNavbarList } from "constants/navbarLists";
import type { NextPage } from "next";
import Head from "next/head";
import { Company } from "types/Company";
import { RoutesCreator } from "utils/RoutesCreator";
import styles from "styles/pages/staff/company/[id]/StaffEditCompanyPage.module.scss";
import {
    DefaultCompanyCreatingForm,
    DefaultCompanyCreatingFormOnSubmitData,
} from "components/forms/DefaultCompanyCreatingForm";
import { useDispatch } from "react-redux";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { StoreWrapper } from "utils/StoreWrapper";

const StaffEditCompanyPage: NextPage<StaffEditCompanyPageProps> = (props: StaffEditCompanyPageProps) => {
    const dispatch = useDispatch();

    async function updateCompanyOnClickHandler(data: DefaultCompanyCreatingFormOnSubmitData) {
        const newData: { [key: string]: string } = {};

        Object.keys(data).forEach((key) => {
            if (data[key as keyof DefaultCompanyCreatingFormOnSubmitData])
                newData[key] = data[key as keyof DefaultCompanyCreatingFormOnSubmitData] as string;
        });

        const result = await CompanyAPI.editCompany(props.company.id, newData);

        if (result.status === 200) {
            location.assign(RoutesCreator.getStaffCompanyPageRoute(props.company.id));
            return;
        }

        dispatch(AlertionActionCreator.createAlerion("Произошла ошибка!", "error"));
        console.log(result);
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
                        {
                            text: "Редактирование",
                            url: RoutesCreator.getStaffEditCompanyPageRoute(props.company.id),
                        },
                    ]}
                />

                <Card>
                    <h3 className={styles.title}>{props.company.full_name}</h3>
                    <DefaultCompanyCreatingForm
                        defaultData={{
                            full_name: props.company.full_name || "",
                            short_name: props.company.short_name || "",
                            address: props.company.address || "",
                            inn: props.company.inn || "",
                            ogrn: props.company.ogrn || "",
                            okpo: props.company.okpo || "",
                            bik: props.company.bik || "",
                            phone: props.company.phone || "",
                            email: props.company.email || "",
                            kpp: props.company.kpp || "",
                            rs: props.company.rs || "",
                            ks: props.company.ks || "",

                            owner: "",
                        }}
                        onSubmit={updateCompanyOnClickHandler}
                        buttonText={"Сохранить"}
                    />
                </Card>
            </AccountPageWrapper>
        </>
    );
};

StaffEditCompanyPage.getInitialProps = StoreWrapper.getInitialPageProps<StaffEditCompanyPageProps>(
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

type StaffEditCompanyPageProps = { company: Company };

export default StaffEditCompanyPage;
