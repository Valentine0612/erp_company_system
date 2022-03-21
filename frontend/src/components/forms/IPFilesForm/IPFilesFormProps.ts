import { IPFilesFormOnSubmitData } from ".";

export type IPFilesFormProps = {
    backButtonOnClick?: () => void;
    onSubmit?: (data: IPFilesFormOnSubmitData) => void;
};
