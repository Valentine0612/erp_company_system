import React from "react";
import { useForm } from "react-hook-form";
import { acceptedFilesTypes } from "constants/acceptedFilesTypes";
import { Button } from "components/shared/Button";
import { FileInput } from "components/shared/FileInput";
import { FormErrorsBlock } from "components/shared/FormErrorsBlock";
import styles from "./RIGFilesForm.module.scss";
import { RIGFilesFormProps } from "./RIGFilesFormProps";

function RIGFilesForm(props: RIGFilesFormProps) {
    const { register, formState, handleSubmit } = useForm<RIGFilesFormUseFormData>();

    function onSubmit(formData: RIGFilesFormUseFormData) {
        const data: RIGFilesFormOnSubmitData = {
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
            migrate: {
                title: "Миграционная карта",
                file: formData.migrate[0],
            },
            notification: {
                title: "Уведомление о пребывании на территории РФ",
                file: formData.notification[0],
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
                    <span>Миграционная карта</span>
                    <FileInput
                        placeholder="Загрузить документ"
                        error={Boolean(formState.errors.migrate)}
                        accept={acceptedFilesTypes}
                        {...register("migrate", {
                            required: "Миграционная карта - обязательное поле",
                        })}
                    />
                </div>

                <div className={styles.filesTableItem}>
                    <span>Уведомление о пребывании на территории РФ</span>
                    <FileInput
                        placeholder="Загрузить документ"
                        error={Boolean(formState.errors.notification)}
                        accept={acceptedFilesTypes}
                        {...register("notification", {
                            required: "Уведомление о пребывании на территории РФ - обязательное поле",
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

type RIGFilesFormUseFormData = {
    password_1: FileList;
    password_2: FileList;
    selfi: FileList;
    migrate: FileList;
    notification: FileList;
};

type RIGFilesFormOnSubmitData = {
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
    migrate: {
        title: string;
        file: File;
    };
    notification: {
        title: string;
        file: File;
    };
};

export { RIGFilesForm };
export type { RIGFilesFormOnSubmitData };
