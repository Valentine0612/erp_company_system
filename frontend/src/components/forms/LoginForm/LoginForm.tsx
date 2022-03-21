import React from "react";
import { useFormPropsErrors } from "hooks/useFormPropsErrors";
import { Button } from "components/shared/Button";
import { FormErrorsBlock } from "components/shared/FormErrorsBlock";
import { Input } from "components/shared/Input";
import { PasswordInput } from "components/shared/PasswordInput";
import styles from "./LoginForm.module.scss";
import { LoginFormProps } from "./LoginFormProps";

function LoginForm(props: LoginFormProps) {
    const { register, formState, handleSubmit, clearErrors } = useFormPropsErrors<LoginFormUseFormData>(props.errors);

    function onSubmit(formData: LoginFormUseFormData) {
        const data: LoginFormOnSubmitData = {
            ...formData,
        };

        if (props.onSubmit) props.onSubmit(data);
    }

    const loginInputRegister = register("login", { required: "Логин - обязательное поле" });
    const passwordInputRegister = register("password", { required: "Пароль - обязательное поле" });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.inputsBlock}>
                <Input
                    placeholder="Логин"
                    wrapperClassName={styles.formElement}
                    error={Boolean(formState.errors.login || formState.errors.unauthorized)}
                    {...loginInputRegister}
                    onChange={(event) => {
                        clearErrors("unauthorized");
                        loginInputRegister.onChange(event);
                    }}
                />
                <PasswordInput
                    placeholder="Пароль"
                    wrapperClassName={styles.formElement}
                    error={Boolean(formState.errors.password || formState.errors.unauthorized)}
                    {...passwordInputRegister}
                    onChange={(event) => {
                        clearErrors("unauthorized");
                        passwordInputRegister.onChange(event);
                    }}
                />
            </div>

            <FormErrorsBlock errors={formState.errors} className={styles.formElement} />

            <div className={[styles.formElement, styles.linksBlock].join(" ")}>
                <a href="/reset-password" className={styles.forgotPassword}>
                    Забыли пароль?
                </a>
                <span className={styles.slicer}>|</span>
                <a href="/register" className={styles.register}>
                    Регистрация
                </a>
            </div>

            <Button className={styles.formElement}>Войти</Button>
        </form>
    );
}

type LoginFormUseFormData = { unauthorized: undefined; login: string; password: string };
type LoginFormOnSubmitData = { login: string; password: string };

export { LoginForm };
export type { LoginFormOnSubmitData };
