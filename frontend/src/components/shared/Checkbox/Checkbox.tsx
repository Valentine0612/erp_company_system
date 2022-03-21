import React from "react";
import styles from "./Checkbox.module.scss";
import { CheckboxProps } from "./CheckboxProps";

function Checkbox(
    { className, wrapperClassName, labelClassName, labelInvisible, label, id, ...otherProps }: CheckboxProps,
    ref: React.ForwardedRef<HTMLInputElement>
) {
    return (
        <div className={[styles.checkboxWrapper, wrapperClassName].join(" ").trim()}>
            <input
                ref={ref}
                id={id}
                className={[styles.checkbox, className].join(" ").trim()}
                {...otherProps}
                type="checkbox"
            />
            <label
                htmlFor={id}
                className={[styles.checkboxLabel, (labelInvisible && styles.invisible) || "", labelClassName]
                    .join(" ")
                    .trim()}
            >
                <span>{label}</span>
            </label>
        </div>
    );
}

const CheckboxComponent = React.forwardRef(Checkbox);

export { CheckboxComponent as Checkbox };
