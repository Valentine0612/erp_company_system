import { DateInputProps } from "./DateInput.props";
import styles from "./DateInput.module.scss";
import React from "react";
import { Input } from "components/shared/Input";

function DateInput({ inputClassName, icon, ...otherProps }: DateInputProps, ref: React.ForwardedRef<HTMLInputElement>) {
    return (
        <Input
            type="date"
            inputClassName={[styles.inputClassName, inputClassName].join(" ")}
            data-icon-content={icon || ""}
            ref={ref}
            {...otherProps}
        />
    );
}

const DateInputComponent = React.forwardRef(DateInput);
export { DateInputComponent };
