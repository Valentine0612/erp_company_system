import { DaDataBank, DaDataCompany } from "types/DaDataTypes";
import { DefaultCompanyCreatingFormOnSubmitData } from ".";
import { FormComponentWirhPropsErrors } from "types/forms/FormComponentWirhPropsErrors";

export type DefaultCompanyCreatingFormProps = {
    defaultDaDataCompany?: DaDataCompany;
    defaultDaDataBank?: DaDataBank;
    defaultData?: DefaultCompanyCreatingFormOnSubmitData;
    onSubmit?: (data: DefaultCompanyCreatingFormOnSubmitData) => void;

    withoutOwner?: boolean;
    buttonText?: string;
} & FormComponentWirhPropsErrors;
