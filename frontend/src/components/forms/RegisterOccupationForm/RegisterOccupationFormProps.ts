import { RegisterOccupationFormOnSubmitData } from ".";

export type RegisterOccupationFormProps = {
    defaultData?: RegisterOccupationFormOnSubmitData;
    onSubmit?: (data: RegisterOccupationFormOnSubmitData) => void;
};
