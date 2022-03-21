import React from "react";
import { EMAIL_REGEXP } from "constants/regexps";
import { useFormPropsErrors } from "hooks/useFormPropsErrors";
import { Button } from "components/shared/Button";
import { FormErrorsBlock } from "components/shared/FormErrorsBlock";
import { Input } from "components/shared/Input";
import styles from "./ResetPasswordForm.module.scss";
import { ResetPasswordFormProps } from "./ResetPasswordFormProps";

function ResetPasswordForm(props: ResetPasswordFormProps) {
    const { register, formState, handleSubmit } = useFormPropsErrors<ResetPasswordFormOnSubmitData>(props.errors);

    function onSubmit(formData: ResetPasswordFormOnSubmitData) {
        const data: ResetPasswordFormOnSubmitData = {
            ...formData,
        };

        if (props.onSubmit) props.onSubmit(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input
                placeholder="Email"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.email)}
                {...register("email", {
                    required: "Email - обязательное поле",
                    pattern: {
                        value: EMAIL_REGEXP,
                        message: "Некорректный email. Пример: test@test.com",
                    },
                })}
            />

            <FormErrorsBlock errors={formState.errors} className={styles.mediumMarginBottom} />

            <Button>Отправить письмо на почту</Button>
        </form>
    );
}

type ResetPasswordFormOnSubmitData = {
    email: string;
};

export { ResetPasswordForm };
export type { ResetPasswordFormOnSubmitData };
