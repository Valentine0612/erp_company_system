import { AxiosResponse } from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AuthAPI } from "api/AuthAPI";
import { ResetPasswordForm, ResetPasswordFormOnSubmitData } from "components/forms/ResetPasswordForm";
import { Button } from "components/shared/Button";
import { FormPageWrapper } from "components/wrappers/FormPageWrapper";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { DefaultError } from "types/DefaultError";
import { FormFieldError } from "types/FormFieldError";
import { FormUtils } from "utils/FormUtills";
import { StoreWrapper } from "utils/StoreWrapper";

const loginDefaultErrors: Array<DefaultError> = [
    {
        checkFunction: (response: AxiosResponse) =>
            response.status === 400 &&
            Array.isArray(response.data.email) &&
            response.data.email[0] ===
                "We couldn't find an account associated with that email. Please try a different e-mail address.",
        error: {
            name: "email",
            error: {
                message: "Аккаунта с таким email не найдено",
            },
        },
    },
];

const ResetPasswordPage: NextPage = () => {
    const [formLevel, setFormLevel] = useState(0);
    const [ResetPasswordFormErrors, setResetPasswordFormErrors] = useState<Array<FormFieldError>>([]);

    const dispatch = useDispatch();

    async function onSubmit(data: ResetPasswordFormOnSubmitData) {
        const result = await AuthAPI.resetPassword(data);

        if (result.status === 200) return setFormLevel(1);

        const errors = FormUtils.checkDefaultErrors(result, loginDefaultErrors);

        if (errors.length) return setResetPasswordFormErrors(errors);

        dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
        console.log(result);
    }

    return (
        <>
            <Head>
                <title>Сброс пароля | CyberPay</title>
            </Head>

            <FormPageWrapper>
                {formLevel === 0 && <ResetPasswordForm onSubmit={onSubmit} errors={ResetPasswordFormErrors} />}
                {formLevel === 1 && (
                    <>
                        <h3>Инструкция с дальнейшими действиями отправлена на Email</h3>
                        <Button onClick={() => location.assign("/")}>Готово</Button>
                    </>
                )}
            </FormPageWrapper>
        </>
    );
};

ResetPasswordPage.getInitialProps = StoreWrapper.getInitialPageProps({ authenticatedRedirect: "/" });

export default ResetPasswordPage;
