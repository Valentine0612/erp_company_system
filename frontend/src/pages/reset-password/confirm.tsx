import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import React from "react";
import { useDispatch } from "react-redux";
import { AuthAPI } from "api/AuthAPI";
import {
    ConfirmResetPasswordForm,
    ConfirmResetPasswordFormOnSubmitData,
} from "components/forms/ConfirmResetPasswordForm";
import { FormPageWrapper } from "components/wrappers/FormPageWrapper";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { StoreWrapper } from "utils/StoreWrapper";

const ConfirmResetPasswordPage: NextPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    async function onSubmit(data: ConfirmResetPasswordFormOnSubmitData) {
        const result = await AuthAPI.resetPasswordConfirm({
            ...data,
            token: router.query.token as string,
        });

        if (result.status === 200) return location.assign("/");

        dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
        console.log(result);
    }

    return (
        <>
            <Head>
                <title>Сброс пароля | CyberPay</title>
            </Head>

            <FormPageWrapper>
                <ConfirmResetPasswordForm onSubmit={onSubmit} />
            </FormPageWrapper>
        </>
    );
};

ConfirmResetPasswordPage.getInitialProps = StoreWrapper.getInitialPageProps({
    authenticatedRedirect: "/",
    hasQueryParams: { params: ["token"], redirectLocation: "/" },
});

export default ConfirmResetPasswordPage;
