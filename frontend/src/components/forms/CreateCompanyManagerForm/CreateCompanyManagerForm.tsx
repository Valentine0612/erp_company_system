import React from "react";
import { EMAIL_REGEXP } from "constants/regexps";
import { useFormPropsErrors } from "hooks/useFormPropsErrors";
import { Button } from "components/shared/Button";
import { FormErrorsBlock } from "components/shared/FormErrorsBlock";
import { Input } from "components/shared/Input";
import { PatternInput } from "components/shared/PatternInput";
import styles from "./CreateCompanyManagerForm.module.scss";
import { CreateCompanyManagerFormProps } from "./CreateCompanyManagerFormProps";

function CreateCompanyManagerForm(props: CreateCompanyManagerFormProps) {
    const { register, formState, handleSubmit } = useFormPropsErrors<CreateCompanyManagerFormOnSubmitData>(
        props.errors
    );

    function onSubmit(formData: CreateCompanyManagerFormOnSubmitData) {
        const data: CreateCompanyManagerFormOnSubmitData = {
            ...formData,
            phone: "+" + (formData.phone as string).replaceAll(/\D/g, ""),
        };

        if (props.onSubmit) props.onSubmit(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input
                placeholder="Фамилия"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.surname)}
                maxLength={100}
                defaultValue={props.defaultData?.surname}
                {...register("surname", {
                    required: "Фамилия - обязательное поле",
                    maxLength: {
                        value: 100,
                        message: "Максимальная длина фамилии 100 символов",
                    },
                })}
            />

            <Input
                placeholder="Имя"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.name)}
                maxLength={100}
                defaultValue={props.defaultData?.name}
                {...register("name", {
                    required: "Имя - обязательное поле",
                    maxLength: { value: 100, message: "Максимальная длина имени 100 символов" },
                })}
            />

            <Input
                placeholder="Отчество"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.patronymic)}
                maxLength={100}
                defaultValue={props.defaultData?.patronymic}
                {...register("patronymic", {
                    maxLength: {
                        value: 100,
                        message: "Макимальная длина отчества - 100 символов",
                    },
                })}
            />

            <Input
                placeholder="Email"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.email)}
                defaultValue={props.defaultData?.email}
                {...register("email", {
                    required: "Email - обязательное поле",
                    pattern: {
                        value: EMAIL_REGEXP,
                        message: "Некорректный email. Пример: test@test.com",
                    },
                })}
            />

            <PatternInput
                placeholder="Телефон"
                pattern={"+7 (___) ___-__-__"}
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.phone)}
                defaultValue={props.defaultData?.phone.slice(2)}
                {...register("phone", {
                    required: "Телефон - обязательное поле",
                    validate: { patternNotFilled: (value) => value.search("_") === -1 || "Телефон введен некорректно" },
                })}
            />

            <FormErrorsBlock errors={formState.errors} className={styles.mediumMarginBottom} />

            <div className={styles.buttonsBlock}>
                <Button
                    type="button"
                    className={styles.whiteButton}
                    onClick={() => props.backButtonOnClick && props.backButtonOnClick()}
                >
                    Назад
                </Button>

                <Button>Создать</Button>
            </div>
        </form>
    );
}

type CreateCompanyManagerFormOnSubmitData = {
    name: string;
    surname: string;
    patronymic?: string;
    email: string;
    phone: string;
};

export { CreateCompanyManagerForm };
export type { CreateCompanyManagerFormOnSubmitData };
