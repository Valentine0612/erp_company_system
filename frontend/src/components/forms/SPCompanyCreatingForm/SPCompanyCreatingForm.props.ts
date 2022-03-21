import { DaDataBank, DaDataCompany } from "types/DaDataTypes";
import { SPCompanyCreatingFormOnSubmitData } from ".";
import { FormComponentWirhPropsErrors } from "types/forms/FormComponentWirhPropsErrors";

export type SPCompanyCreatingFormProps = {
    defaultDaDataCompany: DaDataCompany;
    defaultDaDataBank: DaDataBank;
    defaultData?: SPCompanyCreatingFormOnSubmitData;
    onSubmit?: (data: SPCompanyCreatingFormOnSubmitData) => void;
} & FormComponentWirhPropsErrors;
