import React from "react";
import { useForm } from "react-hook-form";
import { PASSWORD_REGEXP, PASSWORD_REGEXP_ERROR_MESSAGE } from "constants/regexps";
import { Button } from "components/shared/Button";
import { FormErrorsBlock } from "components/shared/FormErrorsBlock";
import { PasswordInput } from "components/shared/PasswordInput";
import styles from "./ConfirmResetPasswordForm.module.scss";
import { ConfirmResetPasswordFormProps } from "./ConfirmResetPasswordFormProps";

function ConfirmResetPasswordForm(props: ConfirmResetPasswordFormProps) {
    const { register, formState, handleSubmit, getValues } = useForm<ConfirmResetPasswordFormUseFormData>();

    function onSubmit(formData: ConfirmResetPasswordFormUseFormData) {
        if (props.onSubmit) props.onSubmit({ password: formData.password });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <PasswordInput
                placeholder="Новый пароль"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.password)}
                {...register("password", {
                    required: "Новый пароль - обязательное поле",
                    pattern: {
                        value: PASSWORD_REGEXP,
                        message: PASSWORD_REGEXP_ERROR_MESSAGE,
                    },
                })}
            />

            <PasswordInput
                placeholder="Повторите пароль"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.re_password)}
                {...register("re_password", {
                    validate: {
                        passwordsNotEqual: (value) => value === getValues("password") || "Пароли не совпадают",
                    },
                })}
            />

            <FormErrorsBlock errors={formState.errors} className={styles.mediumMarginBottom} />

            <Button>Обновить пароль</Button>
        </form>
    );
}

type ConfirmResetPasswordFormUseFormData = {
    password: string;
    re_password: string;
};

type ConfirmResetPasswordFormOnSubmitData = {
    password: string;
};

export { ConfirmResetPasswordForm };
export type { ConfirmResetPasswordFormOnSubmitData };
