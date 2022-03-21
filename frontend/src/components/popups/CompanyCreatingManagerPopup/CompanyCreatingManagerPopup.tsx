import { Button, FormErrorsBlock, Input, PatternInput } from "components/shared";
import { EMAIL_REGEXP } from "constants/regexps";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "store";
import { PopupActionCreator } from "store/actionCreators/PopupActionCreator";
import styles from "./CompanyCreatingManagerPopup.module.scss";

export function CompanyCreatingManagerPopup() {
    const popupData = useSelector((state: IState) => state.popup.data as CompanyCreatingManagerPopupData | null);
    const isPopupOpened = useSelector((state: IState) => state.popup.isOpen);
    const dispatch = useDispatch();

    const { register, formState, handleSubmit, reset } = useForm<CompanyManagerCreatingFormData>({
        defaultValues: popupData?.formData,
    });

    function onSubmit(formData: CompanyManagerCreatingFormData) {
        if (popupData?.onSubmit)
            popupData?.onSubmit({
                ...formData,
                phone: "+" + (formData.phone as string).replaceAll(/\D/g, ""),
            });

        dispatch(PopupActionCreator.closePopup());
    }

    useEffect(() => {
        reset();
    }, [isPopupOpened]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <h3>Новый менеджер</h3>

            <Input
                placeholder="Фамилия"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.surname)}
                maxLength={100}
                {...register("surname", {
                    required: "Фамилия - обязательное поле",
                    maxLength: {
                        value: 100,
                        message: "Максимальная длина фамилии 100 символов",
                    },
                })}
            />

            <Input
                placeholder="Имя"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.name)}
                maxLength={100}
                {...register("name", {
                    required: "Имя - обязательное поле",
                    maxLength: { value: 100, message: "Максимальная длина имени 100 символов" },
                })}
            />

            <Input
                placeholder="Отчество"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.patronymic)}
                maxLength={100}
                {...register("patronymic", {
                    maxLength: {
                        value: 100,
                        message: "Макимальная длина отчества - 100 символов",
                    },
                })}
            />

            <Input
                placeholder="Email"
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.email)}
                {...register("email", {
                    required: "Email - обязательное поле",
                    pattern: {
                        value: EMAIL_REGEXP,
                        message: "Некорректный email. Пример: test@test.com",
                    },
                })}
            />

            <PatternInput
                placeholder="Телефон"
                pattern={"+7 (___) ___-__-__"}
                wrapperClassName={styles.mediumMarginBottom}
                error={Boolean(formState.errors.phone)}
                {...register("phone", {
                    required: "Телефон - обязательное поле",
                    validate: {
                        patternNotFilled: (value) => value.search("_") === -1 || "Телефон заполнен не корректно",
                    },
                })}
            />

            <FormErrorsBlock errors={formState.errors} className={styles.mediumMarginBottom} />

            <Button>Сохранить</Button>
        </form>
    );
}

export type CompanyManagerCreatingFormData = {
    surname: string;
    name: string;
    patronymic: string;
    email: string;
    phone: string;
};

export type CompanyCreatingManagerPopupData = {
    formData?: CompanyManagerCreatingFormData;
    onSubmit: (data: CompanyManagerCreatingFormData) => void;
};
