import { BankSearchInput, Button, FormErrorsBlock, Input } from "components/shared";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DaDataBank } from "types/DaDataTypes";
import { KS_REGEXP, RS_REGEXP } from "constants/regexps";
import styles from "./BankDetailsForm.module.scss";
import { BankDetailsFormProps } from "./BankDetailsForm.props";

function BankDetailsForm(props: BankDetailsFormProps) {
    const { register, formState, handleSubmit, setError, clearErrors } = useForm<BankDetailsFormOnSubmitData>();
    const [selectedBank, setSelectedBank] = useState<DaDataBank | undefined>(props.defaultData?.selectedBank);

    function onSubmit(formData: BankDetailsFormOnSubmitData) {
        if (!selectedBank) return setError("selectedBank", { message: "Банк не выбран" });
        if (props.onSubmit) props.onSubmit({ ...formData, selectedBank });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <BankSearchInput
                wrapperClassName={styles.mediumMarginBottom}
                placeholder={"Введите название, БИК, SWIFT или ИНН банка"}
                unfoundClickText={"Банков с такими данными не найдены"}
                error={Boolean(formState.errors.selectedBank)}
                saveInputValueAfterSelect={(selectedBank) => selectedBank.data.name.payment}
                defaultText={selectedBank?.data.name.payment || ""}
                onSelect={(selectedBank) => {
                    clearErrors("selectedBank");
                    setSelectedBank(selectedBank);
                }}
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
                placeholder="КС"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.ks)}
                defaultValue={props.defaultData?.ks || ""}
                maxLength={20}
                {...register("ks", {
                    required: "КС - обязательное поле",
                    pattern: { value: KS_REGEXP, message: "КС должен содержать 20 цифр" },
                })}
            />

            <FormErrorsBlock className={styles.mediumMarginBottom} errors={formState.errors} />

            <p className={[styles.mediumMarginBottom, styles.info].join(" ").trim()}>
                В случае оплаты по карте сервис удерживает с него дополнительную комиссию в размере 10%.
            </p>

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

type BankDetailsFormOnSubmitData = {
    selectedBank: DaDataBank;
    rs: string;
    ks: string;
};

export { BankDetailsForm };
export type { BankDetailsFormOnSubmitData };
