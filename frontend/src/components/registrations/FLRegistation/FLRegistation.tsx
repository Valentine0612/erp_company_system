import base64 from "base-64";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FLRegistationProps } from ".";
import { AuthAPI, AuthAPIRegisterFLSZRequestData } from "api/AuthAPI";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { AcceptForm } from "components/forms/AcceptForm";
import { BankDetailsForm, BankDetailsFormOnSubmitData } from "components/forms/BankDetailsForm";
import { PersonDataForm, PersonDataFormOnSubmitData } from "components/forms/PersonDataForm";
import { PersonDocumentsDataForm, PersonDocumentsDataFormOnSubmitData } from "components/forms/PersonDocumentsDataForm";
import { PersonFilesForm, PersonFilesFormOnSubmitData } from "components/forms/PersonFilesForm";
import { Button } from "components/shared/Button";
import { ProgressBar } from "components/shared/ProgressBar";
import { FormPageWrapper } from "components/wrappers/FormPageWrapper";
import styles from "./FLRegistation.module.scss";
import { OccupationTypeEnum } from "enums/OccupationTypeEnum";

enum FLRegistationStudiesEnum {
    personDataForm = 0,
    personDocumentsDataForm = 1,
    personFilesForm = 2,
    bankDetailsForm = 3,
    acceptRegistrationForm = 4,
    successRegistration = 5,
}

function FLRegistation(props: FLRegistationProps) {
    const [registerLevel, setRegisterLevel] = useState<number>(FLRegistationStudiesEnum.personDataForm);

    const [personData, setPersonData] = useState<PersonDataFormOnSubmitData>();
    const [personDocumentsData, setPersonDocumentsData] = useState<PersonDocumentsDataFormOnSubmitData>();
    const [personFiles, setPersonFiles] = useState<PersonFilesFormOnSubmitData>();
    const [bankDetails, setBankDetails] = useState<BankDetailsFormOnSubmitData>();

    const dispatch = useDispatch();
    const router = useRouter();

    async function register() {
        const { selectedBank, ...otherBankDetails } = bankDetails as BankDetailsFormOnSubmitData;
        const { selectedPassportIssuePlace, ...otherDocumentsData } =
            personDocumentsData as PersonDocumentsDataFormOnSubmitData;

        const data: AuthAPIRegisterFLSZRequestData = {
            ...(personData as PersonDataFormOnSubmitData),
            profile: {
                ...otherDocumentsData,
                place_of_issue: selectedPassportIssuePlace.data.name,
                issued_code: selectedPassportIssuePlace.data.code,
                type: props.occupationType,
                bankdetail: {
                    ...otherBankDetails,
                    bik: selectedBank.data.bic,
                },
            },
        };

        const files = (personFiles && Object.entries(personFiles).map((item) => item[1])) || [];

        console.log("data:", data);
        console.log("files:", files);

        let registerLink: string | undefined = undefined;
        if (router.query.u && !Array.isArray(router.query.u)) registerLink = base64.decode(router.query.u);

        const registerResult = await AuthAPI.registerFLSZEmloyee(data, registerLink);

        if (registerResult.status !== 201) {
            dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
            return console.log(registerResult);
        }

        const filesUploadResult = await AuthAPI.registerUploadDocument({
            profile: registerResult.data.user_id as number,
            titles: files.map((file) => file.title),
            image: files.map((file) => file.file),
        });

        if (filesUploadResult.status !== 201) {
            dispatch(AlertionActionCreator.createAlerion("Ошибка загрузки файлов", "error"));
            return console.log(filesUploadResult);
        }

        setRegisterLevel(FLRegistationStudiesEnum.successRegistration);
    }

    const levelComponents = [
        {
            level: FLRegistationStudiesEnum.personDataForm,
            title: "Информация о пользователе",
            component: (
                <PersonDataForm
                    defaultData={personData}
                    onSubmit={(data) => {
                        setPersonData(data);
                        setRegisterLevel(FLRegistationStudiesEnum.personDocumentsDataForm);
                    }}
                />
            ),
        },
        {
            level: FLRegistationStudiesEnum.personDocumentsDataForm,
            title: "Информация о пользователе",
            component: (
                <PersonDocumentsDataForm
                    checkSZStatus={props.occupationType === OccupationTypeEnum.SZ}
                    defaultData={personDocumentsData}
                    backButtonOnClick={() => setRegisterLevel(FLRegistationStudiesEnum.personDataForm)}
                    onSubmit={(data) => {
                        setPersonDocumentsData(data);
                        setRegisterLevel(FLRegistationStudiesEnum.personFilesForm);
                    }}
                />
            ),
        },
        {
            level: FLRegistationStudiesEnum.personFilesForm,
            title: "Необходимые фотографии и документы",
            component: (
                <PersonFilesForm
                    backButtonOnClick={() => setRegisterLevel(FLRegistationStudiesEnum.personDocumentsDataForm)}
                    onSubmit={(data) => {
                        setPersonFiles(data);
                        setRegisterLevel(FLRegistationStudiesEnum.bankDetailsForm);
                    }}
                />
            ),
        },
        {
            level: FLRegistationStudiesEnum.bankDetailsForm,
            title: "Информация о банковском счете",
            component: (
                <BankDetailsForm
                    defaultData={bankDetails}
                    backButtonOnClick={() => setRegisterLevel(FLRegistationStudiesEnum.personFilesForm)}
                    onSubmit={(data) => {
                        setBankDetails(data);
                        setRegisterLevel(FLRegistationStudiesEnum.acceptRegistrationForm);
                    }}
                />
            ),
        },
        {
            level: FLRegistationStudiesEnum.acceptRegistrationForm,
            title: "Подтверждение регистрации",
            component: (
                <AcceptForm
                    backButtonOnClick={() => setRegisterLevel(FLRegistationStudiesEnum.bankDetailsForm)}
                    onSubmit={register}
                />
            ),
        },
        {
            level: FLRegistationStudiesEnum.successRegistration,
            title: "Вы успешно зарегистрировались",
            component: (
                <>
                    <p className={styles.formElement}>
                        Письмо с вашим логином и паролем отправлено на вашу электронную почту
                    </p>
                    <Button className={styles.formElement} onClick={() => location.assign("/")}>
                        Войти
                    </Button>
                </>
            ),
        },
    ];

    const currentLevelComponent = levelComponents.find((form) => registerLevel === form.level);

    return (
        <FormPageWrapper>
            <ProgressBar progress={registerLevel * 25} className={styles.progressBar} />

            <h2 className={styles.title}>{currentLevelComponent?.title}</h2>
            {currentLevelComponent?.component}
        </FormPageWrapper>
    );
}

export { FLRegistation };
