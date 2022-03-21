import { useEffect } from "react";
import { FieldValues, useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import { Path } from "react-hook-form/dist/types/path";
import { FormFieldError } from "types/FormFieldError";

export function useFormPropsErrors<TFieldValues extends FieldValues = FieldValues, TContext extends object = object>(
    propsErrors: Array<FormFieldError> | undefined,
    formConfig?: UseFormProps<TFieldValues, TContext>
): UseFormReturn<TFieldValues, TContext> {
    const formReturn = useForm({
        ...formConfig,
        mode: (propsErrors && propsErrors.length && "onChange") || "onSubmit",
    });

    useEffect(() => {
        if (propsErrors && propsErrors.length) {
            propsErrors.forEach((error) => {
                formReturn.setError(error.name as Path<TFieldValues>, error.error);
            });
        }
    }, [propsErrors]);

    return formReturn;
}
