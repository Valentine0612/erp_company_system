import { PersonFilesFormOnSubmitData } from ".";

export type PersonFilesFormProps = {
    backButtonOnClick?: () => void;
    onSubmit?: (data: PersonFilesFormOnSubmitData) => void;
};
