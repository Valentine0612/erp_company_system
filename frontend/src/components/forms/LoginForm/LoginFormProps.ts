import { LoginFormOnSubmitData } from ".";
import { FormComponentWirhPropsErrors } from "types/forms/FormComponentWirhPropsErrors";

export type LoginFormProps = {
    onSubmit?: (data: LoginFormOnSubmitData) => void;
} & FormComponentWirhPropsErrors;
