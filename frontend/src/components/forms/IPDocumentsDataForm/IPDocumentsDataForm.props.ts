import { IPDocumentsDataFormOnSubmitData } from ".";

export type IPDocumentsDataFormProps = {
    defaultData?: IPDocumentsDataFormOnSubmitData;
    backButtonOnClick?: () => void;
    onSubmit?: (data: IPDocumentsDataFormOnSubmitData) => void;
};
