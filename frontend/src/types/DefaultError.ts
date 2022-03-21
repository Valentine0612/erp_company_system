import { AxiosResponse } from "axios";
import { FormFieldError } from "./FormFieldError";

export type DefaultError = {
    checkFunction: (response: AxiosResponse) => boolean;
    error: FormFieldError;
};
