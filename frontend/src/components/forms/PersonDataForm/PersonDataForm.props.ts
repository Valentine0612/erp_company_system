import { PersonDataFormOnSubmitData } from ".";

export type PersonDataFormProps = {
    defaultData?: PersonDataFormOnSubmitData;
    backButtonOnClick?: () => void;
    onSubmit?: (data: PersonDataFormOnSubmitData) => void;
};
