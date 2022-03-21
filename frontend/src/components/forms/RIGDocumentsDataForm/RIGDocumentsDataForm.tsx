import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { INN_REGEXP } from "constants/regexps";
import { Button } from "components/shared/Button";
import { FormErrorsBlock } from "components/shared/FormErrorsBlock";
import { Input } from "components/shared/Input";
import { Selector } from "components/shared/Selector";
import styles from "./RIGDocumentsDataForm.module.scss";
import { RIGDocumentsDataFormProps } from "./RIGDocumentsDataForm.props";

function RIGDocumentsDataForm(props: RIGDocumentsDataFormProps) {
    const [citizenshipType, setCitizenshipType] = useState<string>();

    const { register, formState, clearErrors, setError, handleSubmit, setValue } =
        useForm<RIGDocumentsDataFormOnSubmitData>({});

    useEffect(() => {
        if (props.defaultData)
            Object.entries(props.defaultData).forEach(([key, value]) =>
                setValue(key as keyof RIGDocumentsDataFormOnSubmitData, value)
            );
    }, []);

    function onSubmit(formData: RIGDocumentsDataFormOnSubmitData) {
        if (!citizenshipType) return setError("citizenship", { message: "Гражданство не выбрано" });

        const data: RIGDocumentsDataFormOnSubmitData = {
            ...formData,
            citizenship: citizenshipType,
        };

        if (props.onSubmit) props.onSubmit(data);
    }

    useEffect(() => {
        if (props.defaultData?.citizenship) setCitizenshipType(props.defaultData?.citizenship);
    }, [props.defaultData?.citizenship]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input
                placeholder="Серия и номер паспорта"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.passport)}
                defaultValue={props.defaultData?.passport}
                {...register("passport", {
                    required: "Серия и номер паспорта - обязательное поле",
                })}
            />

            <Input
                placeholder="Адрес регистрации"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.residence)}
                defaultValue={props.defaultData?.residence}
                maxLength={200}
                {...register("residence", {
                    required: "Адрес регистрации - обязательное поле",
                    maxLength: {
                        value: 200,
                        message: "Макимальная длина адреса регистрации - 200 символов",
                    },
                })}
            />

            <Selector
                keyValue={"RIGDocumentsDataForm__selector"}
                options={props.countries || []}
                textKeyName={"name"}
                defaultText={"Гражданство"}
                defaultValue={(props.countries || []).find((item) => item.name === props.defaultData?.citizenship)}
                className={styles.mediumMarginBottom}
                onSelect={(item) => {
                    clearErrors(["citizenship"]);
                    setCitizenshipType(item.name);
                }}
            />

            <Input
                placeholder="ИНН"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.inn)}
                defaultValue={props.defaultData?.inn}
                maxLength={12}
                {...register("inn", {
                    required: "ИНН - обязательное поле",
                    pattern: { value: INN_REGEXP, message: "ИНН должен содержать 10-12 цифр" },
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

                <Button>Далее</Button>
            </div>
        </form>
    );
}

type RIGDocumentsDataFormOnSubmitData = {
    citizenship: string;
    passport: string;
    residence: string;
    inn: string;
};

export { RIGDocumentsDataForm };
export type { RIGDocumentsDataFormOnSubmitData };
