import base64 from "base-64";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { CompanyAPI } from "api/CompanyAPI";
import { CountryAPI } from "api/CountryAPI";
import { RegisterOccupationForm } from "components/forms/RegisterOccupationForm";
import { FLRegistation } from "components/registrations/FLRegistation";
import { IPRegistation } from "components/registrations/IPRegistation";
import { RIGRegistation } from "components/registrations/RIGRegistation";
import { ProgressBar } from "components/shared/ProgressBar";
import { FormPageWrapper } from "components/wrappers/FormPageWrapper";
import { OccupationTypeEnum } from "enums/OccupationTypeEnum";
import { SubscibeToCompanyStatusEnum } from "enums/SubscibeToCompanyStatusEnum";
import styles from "styles/pages/RegisterPage.module.scss";
import { Country } from "types/Country";
import { StoreWrapper } from "utils/StoreWrapper";
import { RoutesCreator } from "utils/RoutesCreator";

const RegisterPage: NextPage<RegisterPageProps> = (props: RegisterPageProps) => {
    const [selectedOccupation, setSelectedOccupation] = useState<OccupationTypeEnum>();

    const registrationTypes = [
        {
            userType: OccupationTypeEnum.FL,
            component: <FLRegistation occupationType={OccupationTypeEnum.FL} />,
        },
        {
            userType: OccupationTypeEnum.SZ,
            component: <FLRegistation occupationType={OccupationTypeEnum.SZ} />,
        },
        {
            userType: OccupationTypeEnum.IP,
            component: <IPRegistation />,
        },
        {
            userType: OccupationTypeEnum.RIG,
            component: <RIGRegistation countries={props.countries} />,
        },
    ];

    const selectedRegistration =
        selectedOccupation && registrationTypes.find((item) => item.userType === selectedOccupation);

    if (selectedRegistration) return selectedRegistration.component;

    return (
        <>
            <Head>
                <title>Регистрация | CyberPay</title>
            </Head>
            <FormPageWrapper>
                <ProgressBar progress={0} className={styles.progressBar} />
                <h2 className={styles.title}>Регистрация пользователя</h2>
                <RegisterOccupationForm onSubmit={(data) => setSelectedOccupation(data.occupationType)} />
            </FormPageWrapper>
        </>
    );
};

RegisterPage.getInitialProps = StoreWrapper.getInitialPageProps<RegisterPageProps>({}, (store) => async (context) => {
    if (store.getState().user.isAuthenticated) {
        let successSubscribe = SubscibeToCompanyStatusEnum.error;

        if (context.query.u && !Array.isArray(context.query.u)) {
            const companyCode = base64.decode(context.query.u).split("?c=")[1] || "";
            const subscribeCompanyResult = await CompanyAPI.subscribeToCompany(companyCode, context.req);

            if (subscribeCompanyResult.status === 201) successSubscribe = SubscibeToCompanyStatusEnum.success;
            if (subscribeCompanyResult.status === 403) successSubscribe = SubscibeToCompanyStatusEnum.unVerified;
        }

        context.res?.writeHead(302, {
            Location: RoutesCreator.getEmployeeCompaniesRoute(successSubscribe),
        });
        context.res?.end();
        return;
    }

    const countriesResult = await CountryAPI.getAllCountries(context.req);
    return { countries: countriesResult.status === 200 ? countriesResult.data : [] };
});

type RegisterPageProps = { countries: Array<Country> };

export default RegisterPage;
