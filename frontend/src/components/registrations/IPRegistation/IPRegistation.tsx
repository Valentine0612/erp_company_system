import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AuthAPI, AuthAPIRegisterIPRequestData } from "api/AuthAPI";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { AcceptForm } from "components/forms/AcceptForm";
import { BankDetailsForm, BankDetailsFormOnSubmitData } from "components/forms/BankDetailsForm";
import { PersonDataForm, PersonDataFormOnSubmitData } from "components/forms/PersonDataForm";
import { IPDocumentsDataForm, IPDocumentsDataFormOnSubmitData } from "components/forms/IPDocumentsDataForm";
import { Button } from "components/shared/Button";
import { ProgressBar } from "components/shared/ProgressBar";
import { FormPageWrapper } from "components/wrappers/FormPageWrapper";
import styles from "./IPRegistation.module.scss";
import { IPFilesForm, IPFilesFormOnSubmitData } from "components/forms/IPFilesForm";
import { OccupationTypeEnum } from "enums/OccupationTypeEnum";
import { useRouter } from "next/dist/client/router";
import base64 from "base-64";

enum IPRegistationStudiesEnum {
    personDataForm = 0,
    documentsDataForm = 1,
    filesForm = 2,
    bankDetailsForm = 3,
    acceptRegistrationForm = 4,
    successRegistration = 5,
}

function IPRegistation() {
    const [registerLevel, setRegisterLevel] = useState<number>(IPRegistationStudiesEnum.personDataForm);

    const [personData, setPersonData] = useState<PersonDataFormOnSubmitData>();
    const [documentsData, setDocumentsData] = useState<IPDocumentsDataFormOnSubmitData>();
    const [uploadedFiles, setUploadedFiles] = useState<IPFilesFormOnSubmitData>();
    const [bankDetails, setBankDetails] = useState<BankDetailsFormOnSubmitData>();

    const dispatch = useDispatch();
    const router = useRouter();

    async function register() {
        const { selectedBank, ...otherBankDetails } = bankDetails as BankDetailsFormOnSubmitData;
        const { selectedPassportIssuePlace, ...otherDocumentsData } = documentsData as IPDocumentsDataFormOnSubmitData;

        const data: AuthAPIRegisterIPRequestData = {
            ...(personData as PersonDataFormOnSubmitData),
            profile: {
                ...otherDocumentsData,
                place_of_issue: selectedPassportIssuePlace.data.name,
                issued_code: selectedPassportIssuePlace.data.code,
                type: OccupationTypeEnum.IP,
                bankdetail: {
                    ...otherBankDetails,
                    bik: selectedBank.data.bic,
                },
            },
        };

        const files = (uploadedFiles && Object.entries(uploadedFiles).map((item) => item[1])) || [];

        console.log("data:", data);
        console.log("files:", files);

        let registerLink: string | undefined = undefined;
        if (router.query.u && !Array.isArray(router.query.u)) registerLink = base64.decode(router.query.u);

        const registerResult = await AuthAPI.registerIPEmloyee(data, registerLink);

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

        setRegisterLevel(IPRegistationStudiesEnum.successRegistration);
    }

    const levelComponents = [
        {
            level: IPRegistationStudiesEnum.personDataForm,
            title: "Информация о пользователе",
            component: (
                <PersonDataForm
                    defaultData={personData}
                    onSubmit={(data) => {
                        setPersonData(data);
                        setRegisterLevel(IPRegistationStudiesEnum.documentsDataForm);
                    }}
                />
            ),
        },
        {
            level: IPRegistationStudiesEnum.documentsDataForm,
            title: "Информация о пользователе",
            component: (
                <IPDocumentsDataForm
                    defaultData={documentsData}
                    backButtonOnClick={() => setRegisterLevel(IPRegistationStudiesEnum.personDataForm)}
                    onSubmit={(data) => {
                        setDocumentsData(data);
                        setRegisterLevel(IPRegistationStudiesEnum.filesForm);
                    }}
                />
            ),
        },
        {
            level: IPRegistationStudiesEnum.filesForm,
            title: "Необходимые фотографии и документы",
            component: (
                <IPFilesForm
                    backButtonOnClick={() => setRegisterLevel(IPRegistationStudiesEnum.documentsDataForm)}
                    onSubmit={(data) => {
                        setUploadedFiles(data);
                        setRegisterLevel(IPRegistationStudiesEnum.bankDetailsForm);
                    }}
                />
            ),
        },
        {
            level: IPRegistationStudiesEnum.bankDetailsForm,
            title: "Информация о банковском счете",
            component: (
                <BankDetailsForm
                    defaultData={bankDetails}
                    backButtonOnClick={() => setRegisterLevel(IPRegistationStudiesEnum.filesForm)}
                    onSubmit={(data) => {
                        setBankDetails(data);
                        setRegisterLevel(IPRegistationStudiesEnum.acceptRegistrationForm);
                    }}
                    withoutCard
                />
            ),
        },
        {
            level: IPRegistationStudiesEnum.acceptRegistrationForm,
            title: "Подтверждение регистрации",
            component: (
                <AcceptForm
                    backButtonOnClick={() => setRegisterLevel(IPRegistationStudiesEnum.bankDetailsForm)}
                    onSubmit={register}
                />
            ),
        },
        {
            level: IPRegistationStudiesEnum.successRegistration,
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

export { IPRegistation };
