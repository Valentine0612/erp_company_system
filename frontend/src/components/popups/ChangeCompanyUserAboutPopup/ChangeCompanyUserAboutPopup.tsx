import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "store";
import { Textarea, Button, FormErrorsBlock } from "components/shared";
import styles from "./ChangeCompanyUserAboutPopup.module.scss";
import { CompanyAPI } from "api/CompanyAPI";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";

function ChangeCompanyUserAboutPopup() {
    const popupStateData = useSelector((state: IState) => state.popup.data as ChangeCompanyUserAboutPopupStateData);
    const { handleSubmit, formState, register } = useForm<ChangeCompanyUserAboutPopupFormData>({
        defaultValues: { about: popupStateData.defaultAbout || "" },
    });
    const dispatch = useDispatch();

    async function onSubmit(data: ChangeCompanyUserAboutPopupFormData) {
        const result = await CompanyAPI.updateAboutForCompanyUser(popupStateData.userID, data);

        if (result.status === 200) return location.reload();

        dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
        console.log(result);
    }

    return (
        <>
            <h3 className={styles.popupElement}>Измените описание пользователя {popupStateData.username}</h3>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Textarea
                    placeholder="Описание пользователя"
                    rows={5}
                    wrapperClassName={styles.popupElement}
                    {...register("about")}
                />

                <FormErrorsBlock errors={formState.errors} className={styles.popupElement} />

                <Button className={styles.popupElement}>Сохранить</Button>
            </form>
        </>
    );
}

export type ChangeCompanyUserAboutPopupFormData = { about: string };
export type ChangeCompanyUserAboutPopupStateData = {
    userID: number;
    username: string;
    defaultAbout: string;
};

export { ChangeCompanyUserAboutPopup };
