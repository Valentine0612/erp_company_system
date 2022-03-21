import React from "react";
import { useForm } from "react-hook-form";
import { PASSWORD_REGEXP, PASSWORD_REGEXP_ERROR_MESSAGE } from "constants/regexps";
import { Button } from "components/shared/Button";
import { FormErrorsBlock } from "components/shared/FormErrorsBlock";
import { PasswordInput } from "components/shared/PasswordInput";
import styles from "./ProfileUpdatePasswordForm.module.scss";
import { ProfileUpdatePasswordFormProps } from "./ProfileUpdatePasswordFormProps";

function ProfileUpdatePasswordForm(props: ProfileUpdatePasswordFormProps) {
    const { register, formState, handleSubmit, getValues } = useForm<ProfileUpdatePasswordFormOnSubmitData>();

    function onSubmit(data: ProfileUpdatePasswordFormOnSubmitData) {
        if (props.onSubmit) props.onSubmit(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h4 className={styles.resetPasswordTitle}>Обновление пароля (не заполняется, если не требуется):</h4>

            <PasswordInput
                placeholder={"Старый пароль"}
                wrapperClassName={styles.formElement}
                error={Boolean(formState.errors.old_password)}
                {...register("old_password", {
                    required: "Старый пароль - обязательное поле",
                })}
            />

            <PasswordInput
                autoComplete="new-password"
                placeholder={"Новый пароль"}
                wrapperClassName={styles.formElement}
                error={Boolean(formState.errors.password)}
                {...register("password", {
                    required: "Новый пароль - обязательное поле",
                    pattern: {
                        value: PASSWORD_REGEXP,
                        message: PASSWORD_REGEXP_ERROR_MESSAGE.replace("Пароль", "Новый пароль"),
                    },
                    minLength: {
                        value: 8,
                        message: "Новый пароль должен содержать минимум 8 символов",
                    },
                })}
            />

            <PasswordInput
                placeholder={"Повторите новый пароль"}
                wrapperClassName={styles.formElement}
                error={Boolean(formState.errors.password2)}
                {...register("password2", {
                    required: "Повторите новый пароль - обязательное поле",
                    validate: {
                        passwordsNotEqual: (value) => value === getValues("password") || "Пароли не совпадают",
                    },
                })}
            />

            <FormErrorsBlock errors={formState.errors} className={styles.formElement} />

            <Button>Обновить пароль</Button>
        </form>
    );
}

export type ProfileUpdatePasswordFormOnSubmitData = {
    old_password: string;
    password: string;
    password2: string;
};

export { ProfileUpdatePasswordForm };
