import React from "react";
import { Button, FormErrorsBlock, Input, PatternInput } from "components/shared";
import {
    BIK_REGEXP,
    EMAIL_REGEXP,
    INN_REGEXP_LEGAL_ENTITY,
    KPP_REGEXP,
    KS_REGEXP,
    OGRN_REGEXP,
    OKPO_REGEXP,
    RS_REGEXP,
} from "constants/regexps";
import { useFormPropsErrors } from "hooks/useFormPropsErrors";
import styles from "./DefaultCompanyCreatingForm.module.scss";
import { DefaultCompanyCreatingFormProps } from "./DefaultCompanyCreatingForm.props";

function DefaultCompanyCreatingForm(props: DefaultCompanyCreatingFormProps) {
    const ownerDefaultValue =
        props.defaultDaDataCompany?.data.management?.name ||
        [
            props.defaultDaDataCompany?.data.fio?.surname,
            props.defaultDaDataCompany?.data.fio?.name,
            props.defaultDaDataCompany?.data.fio?.patronymic,
        ]
            .filter(Boolean)
            .join(" ");

    const { register, formState, handleSubmit } = useFormPropsErrors<DefaultCompanyCreatingFormOnSubmitData>(
        props.errors,
        {
            defaultValues: {
                full_name: props.defaultDaDataCompany?.data.name.full_with_opf || props.defaultData?.full_name || "",
                short_name: props.defaultDaDataCompany?.data.name.short_with_opf || props.defaultData?.short_name || "",
                owner: ownerDefaultValue || props.defaultData?.owner || "",
                address:
                    props.defaultDaDataCompany?.data.address.unrestricted_value || props.defaultData?.address || "",
                inn: props.defaultDaDataCompany?.data.inn || props.defaultData?.inn || "",
                ogrn: props.defaultDaDataCompany?.data.ogrn || props.defaultData?.ogrn || "",
                okpo: props.defaultDaDataCompany?.data.okpo || props.defaultData?.okpo || "",
                bik: props.defaultDaDataBank?.data.bic || props.defaultData?.bik || "",
                phone: props.defaultData?.phone || "",
                email: props.defaultData?.email || "",
                kpp: props.defaultData?.kpp || "",
                rs: props.defaultData?.rs || "",
                ks: props.defaultData?.ks || "",
            },
        }
    );

    function onSubmit(formData: DefaultCompanyCreatingFormOnSubmitData) {
        const data: DefaultCompanyCreatingFormOnSubmitData = {
            ...formData,
            phone: "+" + (formData.phone as string).replaceAll(/\D/g, ""),
        };

        if (props.onSubmit) props.onSubmit(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input
                placeholder="Полное название"
                wrapperClassName={styles.mediumMarginBottom}
                maxLength={200}
                error={Boolean(formState.errors.full_name)}
                disabled={Boolean(props.defaultDaDataCompany?.data.name.full_with_opf)}
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
                disabled={Boolean(props.defaultDaDataCompany?.data.name.short_with_opf)}
                defaultValue={props.defaultData?.short_name || ""}
                {...register("short_name", {
                    required: "Сокращенное название - обязательное поле",
                    maxLength: {
                        value: 100,
                        message: "Максимальная длина сокращенного названия 200 символов",
                    },
                })}
            />

            {props.withoutOwner && (
                <Input
                    placeholder="ФИО владелеца или руководителя"
                    wrapperClassName={styles.mediumMarginBottom}
                    maxLength={200}
                    error={Boolean(formState.errors.owner)}
                    disabled={Boolean(ownerDefaultValue)}
                    defaultValue={props.defaultData?.owner || ""}
                    {...register("owner", {
                        required: "ФИО владелеца или руководителя - обязательное поле",
                        maxLength: { value: 200, message: "Максимальная длина ФИО владелеца 200 символов" },
                    })}
                />
            )}

            <Input
                placeholder="Адрес"
                wrapperClassName={styles.mediumMarginBottom}
                maxLength={500}
                error={Boolean(formState.errors.address)}
                disabled={Boolean(props.defaultDaDataCompany?.data.address.unrestricted_value)}
                defaultValue={props.defaultData?.address || ""}
                {...register("address", {
                    required: "Адрес - обязательное поле",
                    maxLength: { value: 500, message: "Максимальная длина адреса 500 символов" },
                })}
            />

            <Input
                placeholder="ИНН"
                wrapperClassName={styles.mediumMarginBottom}
                maxLength={10}
                error={Boolean(formState.errors.inn)}
                disabled={Boolean(props.defaultDaDataCompany?.data.inn)}
                defaultValue={props.defaultData?.inn || ""}
                {...register("inn", {
                    required: "ИНН - обязательное поле",
                    pattern: { value: INN_REGEXP_LEGAL_ENTITY, message: "ИНН должен содержать 10 цифр" },
                })}
            />

            <Input
                maxLength={13}
                placeholder="ОГРН"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.ogrn)}
                disabled={Boolean(props.defaultDaDataCompany?.data.ogrn)}
                defaultValue={props.defaultDaDataCompany?.data.ogrn || props.defaultData?.ogrn || ""}
                {...register("ogrn", {
                    required: "ОГРН - обязательное поле",
                    pattern: { value: OGRN_REGEXP, message: "ОГРН должен содержать 13 цифр" },
                })}
            />

            <Input
                placeholder="ОКПО"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.okpo)}
                disabled={Boolean(props.defaultDaDataCompany?.data.okpo)}
                defaultValue={props.defaultDaDataCompany?.data.okpo || props.defaultData?.okpo || ""}
                maxLength={10}
                {...register("okpo", {
                    required: "ОКПО - обязательное поле",
                    pattern: { value: OKPO_REGEXP, message: "ОКПО должен содержать 8 или 10 цифр" },
                })}
            />

            <Input
                placeholder="БИК"
                maxLength={9}
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.bik)}
                disabled={Boolean(props.defaultDaDataBank?.data.bic)}
                defaultValue={props.defaultDaDataBank?.data.bic || props.defaultData?.bik || ""}
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
                defaultValue={props.defaultData?.phone.slice(2) || ""}
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
                maxLength={9}
                placeholder="КПП"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.kpp)}
                defaultValue={props.defaultData?.kpp || ""}
                {...register("kpp", {
                    pattern: { value: KPP_REGEXP, message: "КПП должен содержать 9 цифр" },
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

            <FormErrorsBlock errors={formState.errors} className={styles.mediumMarginBottom} />

            <Button>{props.buttonText || "Далее"}</Button>
        </form>
    );
}

export type DefaultCompanyCreatingFormOnSubmitData = {
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
    kpp?: string;
    rs: string;
    ks: string;
};

export { DefaultCompanyCreatingForm };
