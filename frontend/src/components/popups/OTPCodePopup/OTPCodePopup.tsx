import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { CodeAPI } from "api/CodeAPI";
import { IState } from "store";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { PopupActionCreator } from "store/actionCreators/PopupActionCreator";
import { Button } from "components/shared/Button";
import { CodeInput } from "components/shared/CodeInput";
import { FormErrorsBlock } from "components/shared/FormErrorsBlock";
import styles from "./OTPCodePopup.module.scss";

function OTPCodePopup() {
    const isPopupOpened = useSelector((state: IState) => state.popup.isOpen);
    const popupStateData = useSelector((state: IState) => state.popup.data as OTPCodePopupStateData);
    const { handleSubmit, formState, register } = useForm<OTPCodePopupFormData>();
    const dispatch = useDispatch();

    async function sendOTPCode() {
        const result = await CodeAPI.sendOTPCodeOnEmail();

        if (result.status === 200) return;

        console.log(result);
        dispatch(AlertionActionCreator.createAlerion("Ошибка отправки кода на email", "error"));
        dispatch(PopupActionCreator.closePopup());
    }

    useEffect(() => {
        // Using for reopening popup
        if (isPopupOpened) sendOTPCode();
    }, [isPopupOpened]);

    async function onSubmit(data: OTPCodePopupFormData) {
        if (popupStateData && popupStateData.onSubmit && typeof popupStateData.onSubmit === "function")
            popupStateData.onSubmit(data);
        else {
            console.log(data);
            dispatch(PopupActionCreator.closePopup());
        }
    }

    return (
        <>
            <h3 className={styles.popupElement}>Мы отправили код подтверждения вам на Email!</h3>

            <form onSubmit={handleSubmit(onSubmit)}>
                <CodeInput
                    length={6}
                    placeholder="Введите код"
                    wrapperClassName={styles.popupElement}
                    {...register("code", {
                        pattern: { value: /^\d+$/, message: "Код введен некорректно" },
                    })}
                />

                <FormErrorsBlock errors={formState.errors} className={styles.popupElement} />

                <Button className={styles.popupElement}>Подтвердить</Button>
            </form>
        </>
    );
}

export type OTPCodePopupFormData = { code: string };
export type OTPCodePopupStateData = { onSubmit: (data: OTPCodePopupFormData) => void };

export { OTPCodePopup };
