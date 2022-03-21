import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { INN_REGEXP, OGRNIP_REGEXP, PATTERN_INPUT_NOT_FILLED_REGEXP } from "constants/regexps";
import {
    Button,
    DateInput,
    FormErrorsBlock,
    Input,
    PassportIssuePlaceSearchInput,
    PatternInput,
} from "components/shared";
import styles from "./IPDocumentsDataForm.module.scss";
import { IPDocumentsDataFormProps } from "./IPDocumentsDataForm.props";
import moment from "moment";
import { DEFAULT_DATE_FORMAT, LOCAL_DATE_FORMAT } from "constants/defaults";
import { DaDataPassportIssuePlace } from "types/DaDataTypes";

function IPDocumentsDataForm(props: IPDocumentsDataFormProps) {
    const { register, formState, handleSubmit, setValue, clearErrors, setError } =
        useForm<IPDocumentsDataFormOnSubmitData>();

    const [selectedPassportIssuePlace, setSelectedPassportIssuePlace] = useState<DaDataPassportIssuePlace | undefined>(
        props.defaultData?.selectedPassportIssuePlace
    );

    const minDateMoment = useRef(moment(new Date()).subtract(100, "years"));
    const adulthoodDateMoment = useRef(moment(new Date()).subtract(18, "years"));
    const currentDateMoment = useRef(moment(new Date()));

    useEffect(() => {
        if (props.defaultData)
            Object.entries(props.defaultData).forEach(([key, value]) =>
                setValue(key as keyof IPDocumentsDataFormOnSubmitData, value)
            );
    }, []);

    function onSubmit(formData: IPDocumentsDataFormOnSubmitData) {
        if (!selectedPassportIssuePlace)
            return setError("selectedPassportIssuePlace", { message: "Место выдачи паспорта не выбрано" });

        if (props.onSubmit) props.onSubmit({ ...formData, selectedPassportIssuePlace });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <PassportIssuePlaceSearchInput
                placeholder="Место выдачи паспорта"
                unfoundClickText="Места выдачи паспорта с такими данными не найдены"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.selectedPassportIssuePlace)}
                saveInputValueAfterSelect={(selectedBank) => selectedBank.data.name}
                defaultText={props.defaultData?.selectedPassportIssuePlace.data.name || ""}
                onSelect={(place) => {
                    clearErrors("selectedPassportIssuePlace");
                    setSelectedPassportIssuePlace(place);
                }}
            />

            <PatternInput
                placeholder="Серия и номер паспорта"
                pattern="____ ______"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.passport)}
                defaultValue={props.defaultData?.passport.replaceAll(/\D/g, "")}
                {...register("passport", {
                    required: "Серия и номер паспорта - обязательное поле",
                    pattern: {
                        value: PATTERN_INPUT_NOT_FILLED_REGEXP,
                        message: "Серия и номер паспорта заполнены не корректно",
                    },
                })}
            />

            <DateInput
                placeholder="Дата рождения"
                min={minDateMoment.current.format(DEFAULT_DATE_FORMAT)}
                max={adulthoodDateMoment.current.format(DEFAULT_DATE_FORMAT)}
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.dob)}
                defaultValue={props.defaultData?.dob || ""}
                {...register("dob", {
                    required: "Дата рождения - обязательное поле",
                    validate: {
                        minDate: (value) =>
                            moment(value).isSameOrAfter(minDateMoment.current) ||
                            `Минимальная дата рождения - ${minDateMoment.current.format(LOCAL_DATE_FORMAT)}`,
                        maxDate: (value) =>
                            moment(value).isSameOrBefore(adulthoodDateMoment.current) ||
                            `Максимальная дата рождения - ${adulthoodDateMoment.current.format(LOCAL_DATE_FORMAT)}`,
                    },
                })}
            />

            <Input
                placeholder="Место рождения"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.pob)}
                defaultValue={props.defaultData?.pob}
                maxLength={200}
                {...register("pob", {
                    required: "Место рождения - обязательное поле",
                    maxLength: {
                        value: 200,
                        message: "Макимальная длина места рождения - 200 символов",
                    },
                })}
            />

            <DateInput
                placeholder="Дата регистрации ИП"
                min={minDateMoment.current.format(DEFAULT_DATE_FORMAT)}
                max={currentDateMoment.current.format(DEFAULT_DATE_FORMAT)}
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.registration_date)}
                defaultValue={props.defaultData?.registration_date || ""}
                {...register("registration_date", {
                    required: "Дата регистрации ИП - обязательное поле",
                    validate: {
                        minDate: (value) =>
                            moment(value).isSameOrAfter(minDateMoment.current) ||
                            `Минимальная дата регистрации ИП - ${minDateMoment.current.format(LOCAL_DATE_FORMAT)}`,
                        maxDate: (value) =>
                            moment(value).isSameOrBefore(currentDateMoment.current) ||
                            `Максимальная дата регистрации ИП - ${currentDateMoment.current.format(LOCAL_DATE_FORMAT)}`,
                    },
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

            <Input
                maxLength={15}
                placeholder="ОГРНИП"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.ogrnip)}
                defaultValue={props.defaultData?.ogrnip.replaceAll(/\D/g, "")}
                {...register("ogrnip", {
                    required: "ОГРНИП - обязательное поле",
                    pattern: { value: OGRNIP_REGEXP, message: "ОГРНИП должен содержать 15 цифр" },
                })}
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

type IPDocumentsDataFormOnSubmitData = {
    selectedPassportIssuePlace: DaDataPassportIssuePlace;
    passport: string;
    issued: string;
    residence: string;
    dob: string;
    pob: string;
    ogrnip: string;
    inn: string;
    registration_date: string;
};

export { IPDocumentsDataForm };
export type { IPDocumentsDataFormOnSubmitData };
