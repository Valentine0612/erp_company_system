import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { acceptedImagesTypes } from "constants/acceptedFilesTypes";
import { IState } from "store";
import { Button } from "components/shared/Button";
import { FormErrorsBlock } from "components/shared/FormErrorsBlock";
import { ImageInput } from "components/shared/ImageInput";
import { Input } from "components/shared/Input";
import styles from "./ProfileUpdateInfoForm.module.scss";
import { ProfileUpdateInfoFormProps } from "./ProfileUpdateInfoFormProps";

function ProfileUpdateInfoForm(props: ProfileUpdateInfoFormProps) {
    const { register, formState, handleSubmit } = useForm<ProfileUpdateInfoFormOnSubmitData>();
    const userState = useSelector((state: IState) => state.user.userInfo);

    function onSubmit(data: ProfileUpdateInfoFormOnSubmitData) {
        if (props.onSubmit) props.onSubmit(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.imageBlock}>
                <ImageInput
                    accept={acceptedImagesTypes}
                    defaultValue={userState?.avatar}
                    className={styles.image}
                    error={Boolean(formState.errors.image)}
                    {...register("image")}
                />

                <div className={styles.inputsBlock}>
                    <Input
                        placeholder={"Логин"}
                        wrapperClassName={styles.formElement}
                        defaultValue={userState?.login || ""}
                        error={Boolean(formState.errors.login)}
                        {...register("login", {
                            required: "Логин - обязательное поле",
                            minLength: {
                                value: 10,
                                message: "Минимальная длина логина - 10 символов",
                            },
                        })}
                    />
                </div>
            </div>

            <FormErrorsBlock errors={formState.errors} className={styles.formElement} />

            <Button>Сохранить</Button>
        </form>
    );
}

export type ProfileUpdateInfoFormOnSubmitData = {
    image: FileList;
    login: string;
};

export { ProfileUpdateInfoForm };
