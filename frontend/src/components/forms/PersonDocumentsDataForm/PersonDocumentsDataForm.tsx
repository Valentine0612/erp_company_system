import { DEFAULT_DATE_FORMAT, LOCAL_DATE_FORMAT } from "constants/defaults";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { INN_REGEXP, PATTERN_INPUT_NOT_FILLED_REGEXP } from "constants/regexps";
import {
    Button,
    DateInput,
    FormErrorsBlock,
    Input,
    PassportIssuePlaceSearchInput,
    PatternInput,
} from "components/shared";
import styles from "./PersonDocumentsDataForm.module.scss";
import { PersonDocumentsDataFormProps } from "./PersonDocumentsDataForm.props";
import { DaDataPassportIssuePlace } from "types/DaDataTypes";
import {
    FNSRussiaAPI,
    FNSRussiaAPICheckSZStatusErrorResponceData,
    FNSRussiaAPICheckSZStatusResponceData,
} from "api/FNSRussiaAPI";
import { useDispatch } from "react-redux";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";

function PersonDocumentsDataForm(props: PersonDocumentsDataFormProps) {
    const { register, formState, handleSubmit, setValue, clearErrors, setError } =
        useForm<PersonDocumentsDataFormOnSubmitData>();

    const [selectedPassportIssuePlace, setSelectedPassportIssuePlace] = useState<DaDataPassportIssuePlace | undefined>(
        props.defaultData?.selectedPassportIssuePlace
    );

    const minDateMoment = useRef(moment(new Date()).subtract(100, "years"));
    const adulthoodDateMoment = useRef(moment(new Date()).subtract(18, "years"));
    const currentDateMoment = useRef(moment(new Date()));

    const dispatch = useDispatch();

    useEffect(() => {
        if (props.defaultData)
            Object.entries(props.defaultData).forEach(([key, value]) =>
                setValue(key as keyof PersonDocumentsDataFormOnSubmitData, value)
            );
    }, []);

    async function getPersonSZStatusCheckingError(inn: string) {
        const result = await FNSRussiaAPI.checkSZStatus({ inn });

        if (result.status === 200) {
            if (!(result.data as FNSRussiaAPICheckSZStatusResponceData).status)
                return "Вы не являетесь самозанятым. Для продолжения регистрации получите статус самозанятого.";

            return undefined;
        }

        if (
            result.status === 422 &&
            (result.data as FNSRussiaAPICheckSZStatusErrorResponceData)?.code ===
                "taxpayer.status.service.limited.error"
        )
            return "Мы не можем еще раз проверить являетесь ли вы самозанятым. Повторить позже.";

        if (
            result.status === 422 &&
            (result.data as FNSRussiaAPICheckSZStatusErrorResponceData)?.code ===
                "taxpayer.status.service.unavailable.error"
        )
            return "Мы не можем проверить являетесь ли вы самозанятым. Повторить позже.";

        if (result.status === 422 && (result.data as FNSRussiaAPICheckSZStatusErrorResponceData)?.message)
            return `При проверке являетесь ли вы самозанятым произошла ошибка: ${result.data?.message}`;

        return "При проверке являетесь ли вы самозанятым произошла ошибка.";
    }

    async function onSubmit(formData: PersonDocumentsDataFormOnSubmitData) {
        if (!selectedPassportIssuePlace)
            return setError("selectedPassportIssuePlace", { message: "Место выдачи паспорта не выбрано" });

        if (props.checkSZStatus) {
            const SZCherkingError = await getPersonSZStatusCheckingError(formData.inn);

            if (SZCherkingError) {
                return dispatch(AlertionActionCreator.createAlerion(SZCherkingError, "error", 10000));
            }
        }

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
                placeholder="Дата выдачи паспорта"
                min={minDateMoment.current.format(DEFAULT_DATE_FORMAT)}
                max={currentDateMoment.current.format(DEFAULT_DATE_FORMAT)}
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.issued)}
                defaultValue={props.defaultData?.issued || ""}
                {...register("issued", {
                    required: "Дата выдачи паспорта - обязательное поле",
                    validate: {
                        minDate: (value) =>
                            moment(value).isSameOrAfter(minDateMoment.current) ||
                            `Минимальная датаата выдачи паспорта - ${minDateMoment.current.format(LOCAL_DATE_FORMAT)}`,
                        maxDate: (value) =>
                            moment(value).isSameOrBefore(currentDateMoment.current) ||
                            `Максимальная датаата выдачи паспорта - ${currentDateMoment.current.format(
                                LOCAL_DATE_FORMAT
                            )}`,
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

            <PatternInput
                placeholder="СНИЛС"
                pattern={"___-___-___ __"}
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.snils)}
                defaultValue={props.defaultData?.snils.replaceAll(/\D/g, "")}
                {...register("snils", {
                    required: "СНИЛС - обязательное поле",
                    pattern: { value: PATTERN_INPUT_NOT_FILLED_REGEXP, message: "СНИЛС заполнен не корректно" },
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

            {/* <Button
                type="button"
                className={[styles.mediumMarginBottom, styles.knowINNButton].join(" ").trim()}
                onClick={() => window.open("https://service.nalog.ru/inn.do", "_blank")}
            >
                Узнать ИНН
            </Button> */}

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

type PersonDocumentsDataFormOnSubmitData = {
    selectedPassportIssuePlace: DaDataPassportIssuePlace;
    passport: string;
    issued: string;
    dob: string;
    pob: string;
    residence: string;
    inn: string;
    snils: string;
};

export { PersonDocumentsDataForm };
export type { PersonDocumentsDataFormOnSubmitData };
