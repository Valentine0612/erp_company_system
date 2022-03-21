import { ResetPasswordFormOnSubmitData } from ".";
import { FormComponentWirhPropsErrors } from "types/forms/FormComponentWirhPropsErrors";

export type ResetPasswordFormProps = {
    onSubmit?: (data: ResetPasswordFormOnSubmitData) => void;
} & FormComponentWirhPropsErrors;
