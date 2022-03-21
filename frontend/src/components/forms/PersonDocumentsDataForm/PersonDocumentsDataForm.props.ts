import { PersonDocumentsDataFormOnSubmitData } from ".";

export type PersonDocumentsDataFormProps = {
    checkSZStatus: boolean;
    defaultData?: PersonDocumentsDataFormOnSubmitData;
    backButtonOnClick?: () => void;
    onSubmit?: (data: PersonDocumentsDataFormOnSubmitData) => void;
};
