import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AuthAPI, AuthAPIRegisterRIGRequestData } from "api/AuthAPI";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { AcceptForm } from "components/forms/AcceptForm";
import { BankDetailsForm, BankDetailsFormOnSubmitData } from "components/forms/BankDetailsForm";
import { PersonDataForm, PersonDataFormOnSubmitData } from "components/forms/PersonDataForm";
import { RIGDocumentsDataForm, RIGDocumentsDataFormOnSubmitData } from "components/forms/RIGDocumentsDataForm";
import { Button } from "components/shared/Button";
import { ProgressBar } from "components/shared/ProgressBar";
import { FormPageWrapper } from "components/wrappers/FormPageWrapper";
import styles from "./RIGRegistation.module.scss";
import { RIGFilesForm, RIGFilesFormOnSubmitData } from "components/forms/RIGFilesForm";
import { OccupationTypeEnum } from "enums/OccupationTypeEnum";
import { RIGRegistationProps } from ".";
import { useRouter } from "next/dist/client/router";
import base64 from "base-64";

enum RIGRegistationStudiesEnum {
    personDataForm = 0,
    documentsDataForm = 1,
    filesForm = 2,
    bankDetailsForm = 3,
    acceptRegistrationForm = 4,
    successRegistration = 5,
}

function RIGRegistation(props: RIGRegistationProps) {
    const [registerLevel, setRegisterLevel] = useState<number>(RIGRegistationStudiesEnum.personDataForm);

    const [personData, setPersonData] = useState<PersonDataFormOnSubmitData>();
    const [documentsData, setDocumentsData] = useState<RIGDocumentsDataFormOnSubmitData>();
    const [uploadedFiles, setUploadedFiles] = useState<RIGFilesFormOnSubmitData>();
    const [bankDetails, setBankDetails] = useState<BankDetailsFormOnSubmitData>();

    const dispatch = useDispatch();
    const router = useRouter();

    async function register() {
        const { selectedBank, ...otherBankDetails } = bankDetails as BankDetailsFormOnSubmitData;

        const data: AuthAPIRegisterRIGRequestData = {
            ...(personData as PersonDataFormOnSubmitData),
            profile: {
                ...(documentsData as RIGDocumentsDataFormOnSubmitData),
                type: OccupationTypeEnum.RIG,
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

        const registerResult = await AuthAPI.registerRIGEmloyee(data, registerLink);

        if (registerResult.status !== 201) {
            dispatch(AlertionActionCreator.createAlerion("????????????", "error"));
            return console.log(registerResult);
        }

        const filesUploadResult = await AuthAPI.registerUploadDocument({
            profile: registerResult.data.user_id as number,
            titles: files.map((file) => file.title),
            image: files.map((file) => file.file),
        });

        if (filesUploadResult.status !== 201) {
            dispatch(AlertionActionCreator.createAlerion("???????????? ???????????????? ????????????", "error"));
            return console.log(filesUploadResult);
        }

        setRegisterLevel(RIGRegistationStudiesEnum.successRegistration);
    }

    const levelComponents = [
        {
            level: RIGRegistationStudiesEnum.personDataForm,
            title: "???????????????????? ?? ????????????????????????",
            component: (
                <PersonDataForm
                    defaultData={personData}
                    onSubmit={(data) => {
                        setPersonData(data);
                        setRegisterLevel(RIGRegistationStudiesEnum.documentsDataForm);
                    }}
                />
            ),
        },
        {
            level: RIGRegistationStudiesEnum.documentsDataForm,
            title: "???????????????????? ?? ????????????????????????",
            component: (
                <RIGDocumentsDataForm
                    defaultData={documentsData}
                    backButtonOnClick={() => setRegisterLevel(RIGRegistationStudiesEnum.personDataForm)}
                    countries={props.countries}
                    onSubmit={(data) => {
                        setDocumentsData(data);
                        setRegisterLevel(RIGRegistationStudiesEnum.filesForm);
                    }}
                />
            ),
        },
        {
            level: RIGRegistationStudiesEnum.filesForm,
            title: "?????????????????????? ???????????????????? ?? ??????????????????",
            component: (
                <RIGFilesForm
                    backButtonOnClick={() => setRegisterLevel(RIGRegistationStudiesEnum.documentsDataForm)}
                    onSubmit={(data) => {
                        setUploadedFiles(data);
                        setRegisterLevel(RIGRegistationStudiesEnum.bankDetailsForm);
                    }}
                />
            ),
        },
        {
            level: RIGRegistationStudiesEnum.bankDetailsForm,
            title: "???????????????????? ?? ???????????????????? ??????????",
            component: (
                <BankDetailsForm
                    defaultData={bankDetails}
                    backButtonOnClick={() => setRegisterLevel(RIGRegistationStudiesEnum.filesForm)}
                    onSubmit={(data) => {
                        setBankDetails(data);
                        setRegisterLevel(RIGRegistationStudiesEnum.acceptRegistrationForm);
                    }}
                />
            ),
        },
        {
            level: RIGRegistationStudiesEnum.acceptRegistrationForm,
            title: "?????????????????????????? ??????????????????????",
            component: (
                <AcceptForm
                    backButtonOnClick={() => setRegisterLevel(RIGRegistationStudiesEnum.bankDetailsForm)}
                    onSubmit={register}
                />
            ),
        },
        {
            level: RIGRegistationStudiesEnum.successRegistration,
            title: "???? ?????????????? ????????????????????????????????????",
            component: (
                <>
                    <p className={styles.formElement}>
                        ???????????? ?? ?????????? ?????????????? ?? ?????????????? ???????????????????? ???? ???????? ?????????????????????? ??????????
                    </p>
                    <Button className={styles.formElement} onClick={() => location.assign("/")}>
                        ??????????
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

export { RIGRegistation };
