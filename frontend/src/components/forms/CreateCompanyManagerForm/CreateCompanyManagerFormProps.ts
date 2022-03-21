import { CreateCompanyManagerFormOnSubmitData } from ".";
import { FormComponentWirhPropsErrors } from "types/forms/FormComponentWirhPropsErrors";

export type CreateCompanyManagerFormProps = {
    defaultData?: CreateCompanyManagerFormOnSubmitData;
    backButtonOnClick?: () => void;
    onSubmit?: (data: CreateCompanyManagerFormOnSubmitData) => void;
} & FormComponentWirhPropsErrors;
