import { AxiosResponse } from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AuthAPI } from "api/AuthAPI";
import { LoginForm, LoginFormOnSubmitData } from "components/forms/LoginForm";
import { FormPageWrapper } from "components/wrappers/FormPageWrapper";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { DefaultError } from "types/DefaultError";
import { FormFieldError } from "types/FormFieldError";
import { FormUtils } from "utils/FormUtills";
import { StoreWrapper } from "utils/StoreWrapper";
import { RoutesCreator } from "utils/RoutesCreator";

const loginDefaultErrors: Array<DefaultError> = [
    {
        checkFunction: (response: AxiosResponse) =>
            response.status === 401 && response.data.detail === "No active account found with the given credentials",
        error: {
            name: "unauthorized",
            error: {
                message: "Аккаунта с таким логином и паролем не существует",
            },
        },
    },
];

const HomePage: NextPage = () => {
    const [loginFormErrors, setLoginFormErrors] = useState<Array<FormFieldError>>([]);

    const dispatch = useDispatch();

    async function onSubmit(data: LoginFormOnSubmitData) {
        const result = await AuthAPI.login(data);

        if (result.status === 200) return location.reload();

        const loginErrors = FormUtils.checkDefaultErrors(result, loginDefaultErrors);

        if (loginErrors.length) return setLoginFormErrors(loginErrors);

        dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
        console.log(result);
    }

    return (
        <>
            <Head>
                <title>Вход | CyberPay</title>
            </Head>
            <FormPageWrapper>
                <LoginForm onSubmit={onSubmit} errors={loginFormErrors} />
            </FormPageWrapper>
        </>
    );
};

HomePage.getInitialProps = StoreWrapper.getInitialPageProps({}, (store) => async (context) => {
    const queryString = context.asPath?.slice(1) || "";

    if (store.getState().user.isAuthenticated && store.getState().user.userInfo?.staff) {
        context.res?.writeHead(302, { Location: RoutesCreator.getStaffRoute() + queryString });
        context.res?.end();
        return;
    }

    if (store.getState().user.isAuthenticated && store.getState().user.userInfo?.manager) {
        context.res?.writeHead(302, { Location: RoutesCreator.getManagerRoute() + queryString });
        context.res?.end();
        return;
    }

    if (store.getState().user.isAuthenticated) {
        context.res?.writeHead(302, { Location: RoutesCreator.getEmployeeTasksRoute() + queryString });
        context.res?.end();
        return;
    }
});

export default HomePage;
