import { FieldErrors, FieldValues } from "react-hook-form";

export interface FormErrorsBlockProps {
    className?: string;
    errors: FieldErrors<FieldValues>;
}
