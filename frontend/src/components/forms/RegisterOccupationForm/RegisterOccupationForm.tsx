import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { OccupationTypeEnum, OccupationTypesArray } from "enums/OccupationTypeEnum";
import { Button } from "components/shared/Button";
import { Checkbox } from "components/shared/Checkbox";
import { FormErrorsBlock } from "components/shared/FormErrorsBlock";
import { Selector } from "components/shared/Selector";
import styles from "./RegisterOccupationForm.module.scss";
import { RegisterOccupationFormProps } from "./RegisterOccupationFormProps";
import QRImageSberbank from "../../../../public/images/qr-sberbank.gif";
import QRImageMyNalog from "../../../../public/images/qr-myNalog.gif";
import SberbankLogo from "../../../../public/images/sberbank-logo.png";
import MyNalogLogo from "../../../../public/images/myNalog-logo.png";

function RegisterOccupationForm(props: RegisterOccupationFormProps) {
    const [isSelfEmployedInfoShown, setIsSelfEmployedInfoShown] = useState<boolean>(false);
    const [occupationType, setOccupationType] = useState<OccupationTypeEnum>();
    const { register, formState, clearErrors, setError, handleSubmit } = useForm<RegisterOccupationFormUseFormData>();

    useEffect(() => {
        if (props.defaultData?.occupationType) setOccupationType(props.defaultData?.occupationType);
    }, [props.defaultData?.occupationType]);

    function onSubmit({ checkbox }: RegisterOccupationFormUseFormData) {
        if (checkbox && occupationType === OccupationTypeEnum.FL) return setIsSelfEmployedInfoShown(true);
        if (!occupationType) return setError("occupation", { message: "Тип занятости не выбран" });

        if (props.onSubmit) props.onSubmit({ occupationType });
    }

    function registerAsSZOnClick() {
        if (props.onSubmit) props.onSubmit({ occupationType: OccupationTypeEnum.SZ });
    }

    if (isSelfEmployedInfoShown)
        return (
            <div>
                <div className={styles.selfEmployedInfoBlock}>
                    Стать самозанятым можно с помощью приложения Сбербанк Онлайн или через официальное приложение
                    налоговой службы «Мой налог». Выберите наиболее подходящий для вас способ.
                </div>

                <div className={styles.selfEmployedInfoBlock}>
                    <div className={styles.selfEmployedInfoBlock__titleWrapper}>
                        <img
                            src={SberbankLogo.src}
                            alt="Сбербанк Онлайн"
                            className={styles.selfEmployedInfoBlock__titleImage}
                        />
                        <h4 className={styles.selfEmployedInfoBlock__title}>Сбербанк Онлайн</h4>
                    </div>

                    <div className={styles.selfEmployedInfoBlock__QRWrapper}>
                        <img src={QRImageSberbank.src} alt="Сбербанк Онлайн" className={styles.QRWrapper__qr} />

                        <div className={styles.QRWrapper__info}>
                            <div>Клиенты Сбербанка могут стать самозанятыми через приложение Сбербанк Онлайн</div>

                            <ul className={styles.QRWrapper__requiredList}>
                                <li className={styles.QRWrapper__requiredItem}>Должен быть ИНН</li>
                                <li className={styles.QRWrapper__requiredItem}>
                                    Для граждан РФ, Белоруссии, Армении, Кыргызстана и Казахстана
                                </li>
                                <li className={styles.QRWrapper__requiredItem}>Нужно быть клиентом Сбербанка</li>
                            </ul>
                        </div>
                    </div>

                    <div className={styles.selfEmployedInfoBlock__additionalInfo}>
                        Считайте QR-код для регистрации самозанятого через Сбербанк Онлайн
                    </div>
                </div>

                <div className={styles.selfEmployedInfoBlock}>
                    <div className={styles.selfEmployedInfoBlock__titleWrapper}>
                        <img
                            src={MyNalogLogo.src}
                            alt="Мой налог"
                            className={styles.selfEmployedInfoBlock__titleImage}
                        />
                        <h4 className={styles.selfEmployedInfoBlock__title}>Мой налог</h4>
                    </div>

                    <div className={styles.selfEmployedInfoBlock__QRWrapper}>
                        <img src={QRImageMyNalog.src} alt="Мой налог" className={styles.QRWrapper__qr} />

                        <div className={styles.QRWrapper__info}>
                            <div>Граждане РФ могут стать самозанятыми через приложение Мой налог</div>

                            <ul className={styles.QRWrapper__requiredList}>
                                <li className={styles.QRWrapper__requiredItem}>Должен быть ИНН</li>
                                <li className={styles.QRWrapper__requiredItem}>Для граждан РФ</li>
                                <li className={styles.QRWrapper__requiredItem}>Потребуется паспорт</li>
                            </ul>
                        </div>
                    </div>

                    <div className={styles.selfEmployedInfoBlock__additionalInfo}>
                        Считайте QR-код для регистрации самозанятого через Мой налог
                    </div>
                </div>

                <Button onClick={registerAsSZOnClick}>Я получил статус самозанятого</Button>
            </div>
        );

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Selector
                keyValue={"RegisterOccupationForm__selector"}
                options={OccupationTypesArray}
                textKeyName={"name"}
                defaultText={"Тип занятости"}
                defaultValue={
                    props.defaultData?.occupationType &&
                    OccupationTypesArray.find((item) => item.type === props.defaultData?.occupationType)
                }
                error={Boolean(formState.errors.occupation)}
                className={styles.mediumMarginBottom}
                onSelect={(item) => {
                    clearErrors("occupation");
                    setOccupationType(item.type);
                }}
            />

            {occupationType && occupationType === OccupationTypeEnum.FL && (
                <Checkbox
                    id={"RegisterOccupationForm__checkbox"}
                    label={"Зарегистрируйте меня в качестве Самозанятого"}
                    wrapperClassName={styles.mediumMarginBottom}
                    defaultChecked={Boolean(props.defaultData)}
                    {...register("checkbox")}
                />
            )}

            <FormErrorsBlock errors={formState.errors} className={styles.mediumMarginBottom} />

            <p className={[styles.mediumMarginBottom, styles.acceptInfo].join(" ").trim()}>
                Нажимая на кнопку «Далее», я подтверждаю, что я ознакомлен и согласен с{" "}
                <a href="/" target="_blank" rel="noopener noreferrer">
                    пользовательским соглашением
                </a>{" "}
                и{" "}
                <a href="/" target="_blank" rel="noopener noreferrer">
                    условиями предоставления персональных данных
                </a>
            </p>

            <Button className={styles.formElement}>Далее</Button>
        </form>
    );
}

type RegisterOccupationFormOnSubmitData = { occupationType: OccupationTypeEnum };
type RegisterOccupationFormUseFormData = { occupation: undefined; checkbox: boolean };

export { RegisterOccupationForm };
export type { RegisterOccupationFormOnSubmitData };
