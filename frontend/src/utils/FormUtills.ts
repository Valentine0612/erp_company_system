import { AxiosResponse } from "axios";
import { DefaultError } from "types/DefaultError";
import { FormFieldError } from "types/FormFieldError";

export class FormUtils {
    public static checkDefaultErrors(
        response: AxiosResponse,
        defaultErrors: Array<DefaultError>
    ): Array<FormFieldError> {
        const errors: Array<FormFieldError> = [];

        defaultErrors.forEach((error) => {
            if (error.checkFunction(response)) errors.push(error.error);
        });

        return errors;
    }

    public static checkIsDateInInterval(
        date: string | number,
        interval: { start?: string | number; end?: string | number }
    ) {
        const checkDate = typeof date === "number" ? date : Date.parse(date);
        let result = true;

        if (interval.start) {
            const startDate = typeof interval.start === "number" ? interval.start : Date.parse(interval.start);
            result &&= checkDate >= startDate;
        }

        if (interval.end) {
            const endDate = typeof interval.end === "number" ? interval.end : Date.parse(interval.end);
            result &&= checkDate <= endDate;
        }

        return result;
    }

    public static checkIsDateInCorrectInterval(date: string | number) {
        return this.checkIsDateInInterval(date, { start: "01-01-1900", end: Date.now() });
    }
}
