import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "components/shared/Button";
import { Checkbox } from "components/shared/Checkbox";
import { FormErrorsBlock } from "components/shared/FormErrorsBlock";
import styles from "./AcceptForm.module.scss";
import { AcceptFormProps } from "./AcceptFormProps";

function AcceptForm(props: AcceptFormProps) {
    const { register, formState, handleSubmit } = useForm();

    function onSubmit() {
        if (props.onSubmit) props.onSubmit();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Checkbox
                wrapperClassName={styles.smallMarginBottom}
                labelClassName={styles.label}
                id={"AcceptForm__checkbox_1"}
                label={
                    <>
                        Я подтверждаю, что я ознакомлен и согласен{" "}
                        <a href="/" target="_blank" rel="noopener noreferrer">
                            с условиями использования сервиса.
                        </a>
                    </>
                }
                {...register("checkbox_1", {
                    required: "Необходимо принять условия использования сервиса",
                })}
            />

            <Checkbox
                wrapperClassName={styles.mediumMarginBottom}
                labelClassName={styles.label}
                id={"AcceptForm__checkbox_2"}
                label={
                    <a href="/" target="_blank" rel="noopener noreferrer">
                        Выпустить цифровую подпись
                    </a>
                }
                {...register("checkbox_2", {
                    required: "Необходимо принять выпуск цифровой подписи",
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

                <Button>Готово</Button>
            </div>
        </form>
    );
}

export { AcceptForm };
