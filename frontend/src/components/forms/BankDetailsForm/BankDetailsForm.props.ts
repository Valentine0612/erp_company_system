import { BankDetailsFormOnSubmitData } from ".";

export type BankDetailsFormProps = {
    defaultData?: BankDetailsFormOnSubmitData;
    backButtonOnClick?: () => void;
    onSubmit?: (data: BankDetailsFormOnSubmitData) => void;
    withoutCard?: boolean;
};
