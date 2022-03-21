import React, { useRef, useState } from "react";
import {
    Button,
    DateInput,
    FormErrorsBlock,
    Input,
    PassportIssuePlaceSearchInput,
    PatternInput,
} from "components/shared";
import {
    BIK_REGEXP,
    EMAIL_REGEXP,
    INN_REGEXP,
    KS_REGEXP,
    OGRNIP_REGEXP,
    OKPO_REGEXP,
    RS_REGEXP,
} from "constants/regexps";
import { useFormPropsErrors } from "hooks/useFormPropsErrors";
import styles from "./SPCompanyCreatingForm.module.scss";
import { SPCompanyCreatingFormProps } from "./SPCompanyCreatingForm.props";
import { DEFAULT_DATE_FORMAT, LOCAL_DATE_FORMAT } from "constants/defaults";
import moment from "moment";
import { DaDataPassportIssuePlace } from "types/DaDataTypes";

function SPCompanyCreatingForm(props: SPCompanyCreatingFormProps) {
    function getOwnerDefaultValue() {
        const companyData = props.defaultDaDataCompany.data;

        return (
            companyData.management?.name ||
            [companyData.fio?.surname, companyData.fio?.name, companyData.fio?.patronymic].filter(Boolean).join(" ")
        );
    }

    const [selectedPassportIssuePlace, setSelectedPassportIssuePlace] = useState<DaDataPassportIssuePlace | undefined>(
        props.defaultData?.selectedPassportIssuePlace
    );

    const { register, formState, handleSubmit, clearErrors, setError } =
        useFormPropsErrors<SPCompanyCreatingFormOnSubmitData>(props.errors, {
            defaultValues: {
                full_name: props.defaultDaDataCompany.data.name.full_with_opf || props.defaultData?.full_name || "",
                short_name: props.defaultDaDataCompany.data.name.short_with_opf || props.defaultData?.short_name || "",
                owner: getOwnerDefaultValue() || props.defaultData?.owner || "",
                address: props.defaultDaDataCompany.data.address.unrestricted_value || props.defaultData?.address || "",
                inn: props.defaultDaDataCompany.data.inn || props.defaultData?.inn || "",
                ogrn: props.defaultDaDataCompany.data.ogrn || props.defaultData?.ogrn || "",
                okpo: props.defaultDaDataCompany.data.okpo || props.defaultData?.okpo || "",
                bik: props.defaultDaDataBank.data.bic || props.defaultData?.bik || "",
                phone: props.defaultData?.phone || "",
                email: props.defaultData?.email || "",
                rs: props.defaultData?.rs || "",
                ks: props.defaultData?.ks || "",

                dob: props.defaultData?.dob || "",
                pob: props.defaultData?.pob || "",
                passport: props.defaultData?.passport || "",
                issued: props.defaultData?.issued || "",
                residence: props.defaultData?.residence || "",
            },
        });

    const minDateMoment = useRef(moment(new Date()).subtract(100, "years"));
    const adulthoodDateMoment = useRef(moment(new Date()).subtract(18, "years"));
    const currentDateMoment = useRef(moment(new Date()));

    function onSubmit(formData: SPCompanyCreatingFormOnSubmitData) {
        if (!selectedPassportIssuePlace)
            return setError("selectedPassportIssuePlace", { message: "Место выдачи паспорта не выбрано" });

        if (props.onSubmit)
            props.onSubmit({
                ...formData,
                selectedPassportIssuePlace,
                phone: "+" + (formData.phone as string).replaceAll(/\D/g, ""),
            });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input
                placeholder="Полное название"
                wrapperClassName={styles.mediumMarginBottom}
                maxLength={200}
                error={Boolean(formState.errors.full_name)}
                disabled={Boolean(props.defaultDaDataCompany.data.name.full_with_opf)}
                defaultValue={props.defaultData?.full_name || ""}
                {...register("full_name", {
                    required: "Полное название - обязательное поле",
                    maxLength: {
                        value: 200,
                        message: "Максимальная длина полного названия 200 символов",
                    },
                })}
            />

            <Input
                placeholder="Сокращенное название"
                wrapperClassName={styles.mediumMarginBottom}
                maxLength={100}
                error={Boolean(formState.errors.short_name)}
                disabled={Boolean(props.defaultDaDataCompany.data.name.short_with_opf)}
                defaultValue={props.defaultData?.short_name || ""}
                {...register("short_name", {
                    required: "Сокращенное название - обязательное поле",
                    maxLength: {
                        value: 100,
                        message: "Максимальная длина сокращенного названия 200 символов",
                    },
                })}
            />

            <Input
                placeholder="ФИО владелеца или руководителя"
                wrapperClassName={styles.mediumMarginBottom}
                maxLength={200}
                error={Boolean(formState.errors.owner)}
                disabled={Boolean(getOwnerDefaultValue())}
                defaultValue={props.defaultData?.owner || ""}
                {...register("owner", {
                    required: "ФИО владелеца или руководителя - обязательное поле",
                    maxLength: { value: 200, message: "Максимальная длина ФИО владелеца 200 символов" },
                })}
            />

            <Input
                placeholder="Адрес"
                wrapperClassName={styles.mediumMarginBottom}
                maxLength={500}
                error={Boolean(formState.errors.address)}
                disabled={Boolean(props.defaultDaDataCompany.data.address.unrestricted_value)}
                defaultValue={props.defaultData?.address || ""}
                {...register("address", {
                    required: "Адрес - обязательное поле",
                    maxLength: { value: 500, message: "Максимальная длина адреса 500 символов" },
                })}
            />

            <Input
                placeholder="ИНН"
                wrapperClassName={styles.mediumMarginBottom}
                maxLength={12}
                error={Boolean(formState.errors.inn)}
                disabled={Boolean(props.defaultDaDataCompany.data.inn)}
                defaultValue={props.defaultData?.inn || ""}
                {...register("inn", {
                    required: "ИНН - обязательное поле",
                    pattern: { value: INN_REGEXP, message: "ИНН должен содержать 12 цифр" },
                })}
            />

            <Input
                maxLength={15}
                placeholder="ОГРНИП"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.ogrn)}
                disabled={Boolean(props.defaultDaDataCompany.data.ogrn)}
                defaultValue={props.defaultDaDataCompany.data.ogrn || props.defaultData?.ogrn || ""}
                {...register("ogrn", {
                    required: "ОГРНИП - обязательное поле",
                    pattern: { value: OGRNIP_REGEXP, message: "ОГРНИП должен содержать 15 цифр" },
                })}
            />

            <Input
                placeholder="ОКПО"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.okpo)}
                disabled={Boolean(props.defaultDaDataCompany.data.okpo)}
                defaultValue={props.defaultDaDataCompany.data.okpo || props.defaultData?.okpo || ""}
                maxLength={10}
                {...register("okpo", {
                    required: "ОКПО - обязательное поле",
                    pattern: { value: OKPO_REGEXP, message: "ОКПО должен содержать 8 или 10 цифр" },
                })}
            />

            <Input
                maxLength={9}
                placeholder="БИК"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.bik)}
                disabled={Boolean(props.defaultDaDataBank.data.bic)}
                defaultValue={props.defaultDaDataBank.data.bic || props.defaultData?.bik || ""}
                {...register("bik", {
                    required: "БИК - обязательное поле",
                    pattern: { value: BIK_REGEXP, message: "БИК должен содержать 9 цифр" },
                })}
            />

            <PatternInput
                placeholder="Телефон"
                pattern={"+7 (___) ___-__-__"}
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.phone)}
                defaultValue={props.defaultData?.phone || ""}
                {...register("phone", {
                    required: "Телефон - обязательное поле",
                    validate: {
                        patternNotFilled: (value) => value.search("_") === -1 || "Телефон введен некорректно",
                    },
                })}
            />

            <Input
                placeholder="Email"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.email)}
                defaultValue={props.defaultData?.email || ""}
                {...register("email", {
                    required: "Email - обязательное поле",
                    pattern: {
                        value: EMAIL_REGEXP,
                        message: "Некорректный email. Пример: test@test.com",
                    },
                })}
            />

            <Input
                placeholder="РС"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.rs)}
                defaultValue={props.defaultData?.rs || ""}
                maxLength={22}
                {...register("rs", {
                    required: "РС - обязательное поле",
                    pattern: { value: RS_REGEXP, message: "РС должен содержать 20 или 22 цифры" },
                })}
            />

            <Input
                maxLength={20}
                placeholder="КС"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.ks)}
                defaultValue={props.defaultData?.ks || ""}
                {...register("ks", {
                    required: "КС - обязательное поле",
                    pattern: { value: KS_REGEXP, message: "КС должен содержать 20 цифр" },
                })}
            />

            <DateInput
                placeholder="Дата рождения владельца"
                min={minDateMoment.current.format(DEFAULT_DATE_FORMAT)}
                max={adulthoodDateMoment.current.format(DEFAULT_DATE_FORMAT)}
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.dob)}
                defaultValue={props.defaultData?.dob || ""}
                {...register("dob", {
                    required: "Дата рождения владельца - обязательное поле",
                    validate: {
                        minDate: (value) =>
                            moment(value).isSameOrAfter(minDateMoment.current) ||
                            `Минимальная дата рождения владельца - ${minDateMoment.current.format(LOCAL_DATE_FORMAT)}`,
                        maxDate: (value) =>
                            moment(value).isSameOrBefore(adulthoodDateMoment.current) ||
                            `Максимальная дата рождения владельца - ${adulthoodDateMoment.current.format(
                                LOCAL_DATE_FORMAT
                            )}`,
                    },
                })}
            />

            <Input
                placeholder="Место рождения владельца"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.pob)}
                maxLength={200}
                defaultValue={props.defaultData?.pob || ""}
                {...register("pob", {
                    required: "Место рождения владельца - обязательное поле",
                    maxLength: {
                        value: 200,
                        message: "Макимальная длина места рождения владельца - 200 символов",
                    },
                })}
            />

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
                placeholder="Серия и номер паспорта владельца"
                pattern="____ ______"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.passport)}
                defaultValue={props.defaultData?.passport || ""}
                {...register("passport", {
                    required: "Серия и номер паспорта владельца - обязательное поле",
                    validate: {
                        patternNotFilled: (value) =>
                            value.search("_") === -1 || "Серия и номер паспорта владельца заполнены не корректно",
                    },
                })}
            />

            <DateInput
                placeholder="Дата выдачи паспорта владельца"
                min={minDateMoment.current.format(DEFAULT_DATE_FORMAT)}
                max={currentDateMoment.current.format(DEFAULT_DATE_FORMAT)}
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.issued)}
                defaultValue={props.defaultData?.issued || ""}
                {...register("issued", {
                    required: "Дата выдачи паспорта владельца - обязательное поле",
                    validate: {
                        minDate: (value) =>
                            moment(value).isSameOrAfter(minDateMoment.current) ||
                            `Минимальная датаата выдачи паспорта владельца - ${minDateMoment.current.format(
                                LOCAL_DATE_FORMAT
                            )}`,
                        maxDate: (value) =>
                            moment(value).isSameOrBefore(currentDateMoment.current) ||
                            `Максимальная датаата выдачи паспорта владельца - ${currentDateMoment.current.format(
                                LOCAL_DATE_FORMAT
                            )}`,
                    },
                })}
            />

            <Input
                placeholder="Адрес регистрации владельца"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.residence)}
                maxLength={200}
                defaultValue={props.defaultData?.residence || ""}
                {...register("residence", {
                    required: "Адрес регистрации владельца - обязательное поле",
                    maxLength: {
                        value: 200,
                        message: "Макимальная длина адреса регистрации владельца - 200 символов",
                    },
                })}
            />

            <FormErrorsBlock errors={formState.errors} className={styles.mediumMarginBottom} />

            <Button>Далее</Button>
        </form>
    );
}

export type SPCompanyCreatingFormOnSubmitData = {
    full_name: string;
    short_name: string;
    owner: string;
    address: string;
    inn: string;
    ogrn: string;
    okpo: string;
    bik: string;
    phone: string;
    email: string;
    rs: string;
    ks: string;

    dob: string;
    pob: string;
    residence: string;

    selectedPassportIssuePlace: DaDataPassportIssuePlace;
    passport: string;
    issued: string;
};

export { SPCompanyCreatingForm };
