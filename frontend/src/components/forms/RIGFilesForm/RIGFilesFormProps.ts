import { RIGFilesFormOnSubmitData } from ".";

export type RIGFilesFormProps = {
    backButtonOnClick?: () => void;
    onSubmit?: (data: RIGFilesFormOnSubmitData) => void;
};
