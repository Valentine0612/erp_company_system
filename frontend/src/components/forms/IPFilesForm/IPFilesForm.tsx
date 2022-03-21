import React from "react";
import { useForm } from "react-hook-form";
import { acceptedFilesTypes } from "constants/acceptedFilesTypes";
import { Button } from "components/shared/Button";
import { FileInput } from "components/shared/FileInput";
import { FormErrorsBlock } from "components/shared/FormErrorsBlock";
import styles from "./IPFilesForm.module.scss";
import { IPFilesFormProps } from "./IPFilesFormProps";

function IPFilesForm(props: IPFilesFormProps) {
    const { register, formState, handleSubmit } = useForm<IPFilesFormUseFormData>();

    function onSubmit(formData: IPFilesFormUseFormData) {
        const data: IPFilesFormOnSubmitData = {
            ...formData,
            password_1: {
                title: "Основной разворот паспорта",
                file: formData.password_1[0],
            },
            password_2: {
                title: "Разворот паспорта с пропиской",
                file: formData.password_2[0],
            },
            selfi: {
                title: "Селфи с паспортом",
                file: formData.selfi[0],
            },
            inn: {
                title: "ИНН",
                file: formData.inn[0],
            },
            egrip: {
                title: "Выписка из ЕГРИП или свидетельство",
                file: formData.egrip[0],
            },
        };

        if (props.onSubmit) props.onSubmit(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={[styles.filesTable, styles.largeMarginBottom].join(" ").trim()}>
                <div className={styles.filesTableItem}>
                    <span>Основной разворот паспорта</span>
                    <FileInput
                        placeholder="Загрузить документ"
                        error={Boolean(formState.errors.password_1)}
                        accept={acceptedFilesTypes}
                        {...register("password_1", {
                            required: "Основной разворот паспорта - обязательное поле",
                        })}
                    />
                </div>

                <div className={styles.filesTableItem}>
                    <span>Разворот паспорта с пропиской</span>
                    <FileInput
                        placeholder="Загрузить документ"
                        error={Boolean(formState.errors.password_2)}
                        accept={acceptedFilesTypes}
                        {...register("password_2", {
                            required: "Разворот паспорта с пропиской - обязательное поле",
                        })}
                    />
                </div>

                <div className={styles.filesTableItem}>
                    <span>Селфи с паспортом</span>
                    <FileInput
                        placeholder="Загрузить документ"
                        error={Boolean(formState.errors.selfi)}
                        accept={acceptedFilesTypes}
                        {...register("selfi", {
                            required: "Селфи с паспортом - обязательное поле",
                        })}
                    />
                </div>

                <div className={styles.filesTableItem}>
                    <span>ИНН</span>
                    <FileInput
                        placeholder="Загрузить документ"
                        error={Boolean(formState.errors.inn)}
                        accept={acceptedFilesTypes}
                        {...register("inn", {
                            required: "ИНН - обязательное поле",
                        })}
                    />
                </div>

                <div className={styles.filesTableItem}>
                    <span>Выписка из ЕГРИП или свидетельство</span>
                    <FileInput
                        placeholder="Загрузить документ"
                        error={Boolean(formState.errors.egrip)}
                        accept={acceptedFilesTypes}
                        {...register("egrip", {
                            required: "Выписка из ЕГРИП или свидетельство - обязательное поле",
                        })}
                    />
                </div>
            </div>

            <FormErrorsBlock className={styles.mediumMarginBottom} errors={formState.errors} />

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

type IPFilesFormUseFormData = {
    password_1: FileList;
    password_2: FileList;
    selfi: FileList;
    inn: FileList;
    egrip: FileList;
};

type IPFilesFormOnSubmitData = {
    password_1: {
        title: string;
        file: File;
    };
    password_2: {
        title: string;
        file: File;
    };
    selfi: {
        title: string;
        file: File;
    };
    inn: {
        title: string;
        file: File;
    };
    egrip: {
        title: string;
        file: File;
    };
};

export { IPFilesForm };
export type { IPFilesFormOnSubmitData };
