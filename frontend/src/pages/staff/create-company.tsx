import type { NextPage } from "next";
import React, { useState } from "react";
import { ProgressBar, Card, CompanySearchInput, BankSearchInput, Breadcrumbs } from "components/shared";
import styles from "styles/pages/staff/StaffCreateCompanyPage.module.scss";
import {
    CreateCompanyManagerForm,
    CreateCompanyManagerFormOnSubmitData,
} from "components/forms/CreateCompanyManagerForm";
import { CompanyAPI, CompanyAPICreateCompanyRequestData } from "api/CompanyAPI";
import { staffAccountNavbarList } from "constants/navbarLists";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { Button } from "components/shared/Button";
import { FormFieldError } from "types/FormFieldError";
import { AxiosResponse } from "axios";
import { DefaultError } from "types/DefaultError";
import { FormUtils } from "utils/FormUtills";
import { useDispatch } from "react-redux";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { CompanyTypeEnum } from "enums/CompanyTypeEnum";
import Head from "next/head";
import { RoutesCreator } from "utils/RoutesCreator";
import { DaDataBank, DaDataCompany, DaDataCompanyTypeEnum } from "types/DaDataTypes";
import moment from "moment";
import { DEFAULT_DATE_FORMAT } from "constants/defaults";
import { SPCompanyCreatingForm, SPCompanyCreatingFormOnSubmitData } from "components/forms/SPCompanyCreatingForm";
import {
    DefaultCompanyCreatingForm,
    DefaultCompanyCreatingFormOnSubmitData,
} from "components/forms/DefaultCompanyCreatingForm";
import { StoreWrapper } from "utils/StoreWrapper";

const companyDefaultErrors: Array<DefaultError> = [
    {
        checkFunction: (response: AxiosResponse) =>
            response.status === 400 &&
            Array.isArray(response.data.full_name) &&
            response.data.full_name[0] === "companie with this full name already exists.",
        error: {
            name: "full_name",
            error: {
                message: "Компания с таким именем уже существует",
            },
        },
    },
];

const managerDefaultErrors: Array<DefaultError> = [
    {
        checkFunction: (response: AxiosResponse) =>
            response.status === 400 &&
            Array.isArray(response.data.user) &&
            Array.isArray(response.data.user[0].email) &&
            response.data.user[0].email[0] === "user with this email already exists.",
        error: {
            name: "email",
            error: {
                message: "Менеджер с таким email уже существует",
            },
        },
    },
];

enum StaffCreateCompanyPageStudys {
    FindCompany,
    FindBank,
    FillCompanyForm,
    FillManagerForm,
    Success,
}

const StaffCreateCompanyPage: NextPage = () => {
    const [pageLevel, setPageLevel] = useState(StaffCreateCompanyPageStudys.FindCompany);

    const [сreateCompanyManagerFormData, setCreateCompanyManagerFormOnSubmitData] =
        useState<CreateCompanyManagerFormOnSubmitData>();

    const [daDataSelelctedCompany, setDaDataSelelctedCompany] = useState<DaDataCompany>();
    const [daDataSelelctedBank, setDaDataSelelctedBank] = useState<DaDataBank>();

    const [SPCompanyFormData, setSPCompanyFormData] = useState<SPCompanyCreatingFormOnSubmitData>();
    const [defaultCompanyFormData, setDefaultCompanyFormData] = useState<DefaultCompanyCreatingFormOnSubmitData>();

    const [companyFormErrors, setCompanyFormErrors] = useState<Array<FormFieldError>>([]);
    const [managerFormErrors, setManagerFormErrors] = useState<Array<FormFieldError>>([]);

    const dispatch = useDispatch();

    async function createCompany(data: CompanyAPICreateCompanyRequestData) {
        const result = await CompanyAPI.createCompany(data);

        if (result.status === 201) return setPageLevel(StaffCreateCompanyPageStudys.Success);

        const companyErrors = FormUtils.checkDefaultErrors(result, companyDefaultErrors);
        const managerErrors = FormUtils.checkDefaultErrors(result, managerDefaultErrors);

        if (companyErrors.length || managerErrors.length) {
            setCompanyFormErrors(companyErrors);
            setManagerFormErrors(managerErrors);

            dispatch(
                AlertionActionCreator.createAlerion(
                    [
                        ...companyErrors.map((error) => error.error.message),
                        ...managerErrors.map((error) => error.error.message),
                    ].join("\n"),
                    "error"
                )
            );
            return;
        }

        console.log(result);
        dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
    }

    function createCompanyManagerFormSubmitHandler(data: CreateCompanyManagerFormOnSubmitData) {
        setCreateCompanyManagerFormOnSubmitData(data);

        if (daDataSelelctedCompany?.data.type === DaDataCompanyTypeEnum.INDIVIDUAL) {
            const creationCompanyData = {
                full_name: SPCompanyFormData?.full_name || "",
                short_name: SPCompanyFormData?.short_name || "",
                email: SPCompanyFormData?.email || "",
                address: SPCompanyFormData?.address || "",
                phone: SPCompanyFormData?.phone || "",
                inn: SPCompanyFormData?.inn || "",
                ogrn: SPCompanyFormData?.ogrn || "",
                okpo: SPCompanyFormData?.okpo || "",
                rs: SPCompanyFormData?.rs || "",
                ks: SPCompanyFormData?.ks || "",
                bik: SPCompanyFormData?.bik || "",
                owner: SPCompanyFormData?.owner || "",
                company_type: CompanyTypeEnum.IP,

                user: [data],

                meta_data: {
                    type: CompanyTypeEnum.IP,
                    dob: SPCompanyFormData?.dob || "",
                    pob: SPCompanyFormData?.pob || "",
                    registration_date:
                        moment(daDataSelelctedCompany?.data.state.registration_date).format(DEFAULT_DATE_FORMAT) || "",
                    passport: SPCompanyFormData?.passport || "",
                    issued: SPCompanyFormData?.issued || "",
                    place_of_issue: SPCompanyFormData?.selectedPassportIssuePlace.data.name || "",
                    issued_code: SPCompanyFormData?.selectedPassportIssuePlace.data.code || "",
                    residence: SPCompanyFormData?.residence || "",
                    ogrnip: SPCompanyFormData?.ogrn || "",
                    inn: SPCompanyFormData?.inn || "",
                },
            };

            return createCompany(creationCompanyData);
        }

        const creationCompanyData = {
            full_name: defaultCompanyFormData?.full_name || "",
            short_name: defaultCompanyFormData?.short_name || "",
            email: defaultCompanyFormData?.email || "",
            address: defaultCompanyFormData?.address || "",
            phone: defaultCompanyFormData?.phone || "",
            inn: defaultCompanyFormData?.inn || "",
            ogrn: defaultCompanyFormData?.ogrn || "",
            okpo: defaultCompanyFormData?.okpo || "",
            kpp: defaultCompanyFormData?.kpp || "",
            rs: defaultCompanyFormData?.rs || "",
            ks: defaultCompanyFormData?.ks || "",
            bik: defaultCompanyFormData?.bik || "",
            owner: defaultCompanyFormData?.owner || "",
            company_type: CompanyTypeEnum.OOO,

            user: [data],

            meta_data: {
                type: CompanyTypeEnum.OOO,
            },
        };

        createCompany(creationCompanyData);
        return;
    }

    return (
        <>
            <Head>
                <title>Создание компании | CyberPay</title>
            </Head>

            <AccountPageWrapper navbarList={staffAccountNavbarList}>
                <Breadcrumbs
                    list={[
                        { text: "Кабинет администратора", url: RoutesCreator.getStaffRoute() },
                        { text: "Компании", url: RoutesCreator.getStaffRoute() },
                        { text: "Создание компании", url: RoutesCreator.getStaffCreateCompanyRoute() },
                    ]}
                />

                <Card className={styles.card}>
                    <ProgressBar progress={(pageLevel * 100) / 3} className={styles.progressBar} />

                    {pageLevel === StaffCreateCompanyPageStudys.FindCompany && (
                        <>
                            <h2 className={styles.title}>Информация о компании</h2>
                            <CompanySearchInput
                                onSelect={(company) => {
                                    setDaDataSelelctedCompany(company);
                                    setPageLevel(StaffCreateCompanyPageStudys.FindBank);
                                }}
                                unfoundClickText="Компании с такими данными не найдены"
                            />
                        </>
                    )}

                    {pageLevel === StaffCreateCompanyPageStudys.FindBank && (
                        <>
                            <h2 className={styles.title}>Информация о банке</h2>
                            <BankSearchInput
                                onSelect={(bank) => {
                                    setDaDataSelelctedBank(bank);
                                    setPageLevel(StaffCreateCompanyPageStudys.FillCompanyForm);
                                }}
                                unfoundClickText="Банков с такими данными не найдены"
                            />
                            <Button
                                className={styles.withTopMargin}
                                styleType="white"
                                onClick={() => setPageLevel(StaffCreateCompanyPageStudys.FindCompany)}
                            >
                                Назад
                            </Button>
                        </>
                    )}

                    {pageLevel === StaffCreateCompanyPageStudys.FillCompanyForm && (
                        <>
                            <h2 className={styles.title}>Информация о компании</h2>

                            {daDataSelelctedCompany?.data.type === DaDataCompanyTypeEnum.LEGAL ? (
                                <DefaultCompanyCreatingForm
                                    defaultDaDataCompany={daDataSelelctedCompany as DaDataCompany}
                                    defaultDaDataBank={daDataSelelctedBank as DaDataBank}
                                    defaultData={defaultCompanyFormData}
                                    errors={companyFormErrors}
                                    onSubmit={(data) => {
                                        setPageLevel(StaffCreateCompanyPageStudys.FillManagerForm);
                                        setDefaultCompanyFormData(data);
                                        setCompanyFormErrors([]);
                                    }}
                                />
                            ) : (
                                <SPCompanyCreatingForm
                                    defaultDaDataCompany={daDataSelelctedCompany as DaDataCompany}
                                    defaultDaDataBank={daDataSelelctedBank as DaDataBank}
                                    defaultData={SPCompanyFormData}
                                    errors={companyFormErrors}
                                    onSubmit={(data) => {
                                        setPageLevel(StaffCreateCompanyPageStudys.FillManagerForm);
                                        setSPCompanyFormData(data);
                                        setCompanyFormErrors([]);
                                    }}
                                />
                            )}
                        </>
                    )}

                    {pageLevel === StaffCreateCompanyPageStudys.FillManagerForm && (
                        <>
                            <h2 className={styles.title}>Информация о менеджере</h2>
                            <CreateCompanyManagerForm
                                defaultData={сreateCompanyManagerFormData}
                                backButtonOnClick={() => setPageLevel(StaffCreateCompanyPageStudys.FillCompanyForm)}
                                errors={managerFormErrors}
                                onSubmit={createCompanyManagerFormSubmitHandler}
                            />
                        </>
                    )}

                    {pageLevel === StaffCreateCompanyPageStudys.Success && (
                        <>
                            <h2 className={styles.title}>Компания создана</h2>
                            <Button className={styles.formElement} onClick={() => location.reload()}>
                                Создать еще
                            </Button>

                            <Button className={styles.formElement} onClick={() => location.assign("/staff")}>
                                На главную
                            </Button>
                        </>
                    )}
                </Card>
            </AccountPageWrapper>
        </>
    );
};

StaffCreateCompanyPage.getInitialProps = StoreWrapper.getInitialPageProps({
    notAuthenticatedRedirect: "/",
    storeRedirect: {
        redirect: (store) => !store.user.userInfo?.staff,
        redirectLocation: "/",
    },
});

export default StaffCreateCompanyPage;
