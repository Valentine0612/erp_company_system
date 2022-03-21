import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CheckAPI } from "api/CheckAPI";
import { EMAIL_REGEXP, PATTERN_INPUT_NOT_FILLED_REGEXP } from "constants/regexps";
import { Button } from "components/shared/Button";
import { FormErrorsBlock } from "components/shared/FormErrorsBlock";
import { Input } from "components/shared/Input";
import { PatternInput } from "components/shared/PatternInput";
import styles from "./PersonDataForm.module.scss";
import { PersonDataFormProps } from "./PersonDataForm.props";

function PersonDataForm(props: PersonDataFormProps) {
    const { register, formState, setError, handleSubmit, setValue } = useForm<PersonDataFormOnSubmitData>({});

    useEffect(() => {
        if (props.defaultData)
            Object.entries(props.defaultData).forEach(([key, value]) =>
                setValue(key as keyof PersonDataFormOnSubmitData, value)
            );
    }, []);

    async function onSubmit(formData: PersonDataFormOnSubmitData) {
        if ((await CheckAPI.checkEmailExists(formData.email)).status === 200)
            return setError("email", { message: "Email уже используется" });

        const data: PersonDataFormOnSubmitData = {
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
                defaultValue={props.defaultData?.surname}
                maxLength={100}
                {...register("surname", {
                    required: "Фамилия - обязательное поле",
                    maxLength: {
                        value: 100,
                        message: "Макимальная длина фамилии - 100 символов",
                    },
                })}
            />

            <Input
                placeholder="Имя"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.name)}
                defaultValue={props.defaultData?.name}
                maxLength={100}
                {...register("name", {
                    required: "Имя - обязательное поле",
                    maxLength: {
                        value: 100,
                        message: "Макимальная длина имени - 100 символов",
                    },
                })}
            />

            <Input
                placeholder="Отчество"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.patronymic)}
                defaultValue={props.defaultData?.patronymic}
                maxLength={100}
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
                placeholder="Номер телефона"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.phone)}
                defaultValue={props.defaultData?.phone.slice(2)}
                pattern={"+7 (___) ___-__-__"}
                {...register("phone", {
                    required: "Телефон - обязательное поле",
                    pattern: { value: PATTERN_INPUT_NOT_FILLED_REGEXP, message: "Телефон заполнен не корректно" },
                })}
            />

            <FormErrorsBlock errors={formState.errors} className={styles.mediumMarginBottom} />

            <div className={styles.buttonsBlock}>
                {props.backButtonOnClick && (
                    <Button
                        type="button"
                        className={styles.whiteButton}
                        onClick={() => props.backButtonOnClick && props.backButtonOnClick()}
                    >
                        Назад
                    </Button>
                )}

                <Button>Далее</Button>
            </div>
        </form>
    );
}

type PersonDataFormOnSubmitData = {
    name: string;
    surname: string;
    patronymic: string;
    phone: string;
    email: string;
};

export { PersonDataForm };
export type { PersonDataFormOnSubmitData };
