import { TextareaProps } from "./TextareaProps";
import styles from "./Textarea.module.scss";
import React from "react";

function Textarea(
    {
        wrapperClassName,
        textareaClassName,
        className,
        labelClassName,
        error,
        withoutLabel,
        ...otherProps
    }: TextareaProps,
    ref: React.ForwardedRef<HTMLTextAreaElement>
) {
    return (
        <div className={[styles.wrapper, error && styles.error, wrapperClassName].join(" ").trim()}>
            {!withoutLabel && (
                <label htmlFor={otherProps.id} className={[styles.label, labelClassName].join(" ").trim()}>
                    {otherProps.placeholder}
                </label>
            )}

            <textarea
                ref={ref}
                className={[
                    styles.textarea,
                    (withoutLabel && styles.textareaWithoutLabel) || "",
                    textareaClassName,
                    className,
                ]
                    .join(" ")
                    .trim()}
                {...otherProps}
            />
        </div>
    );
}

const TextareaComponent = React.forwardRef(Textarea);

export { TextareaComponent };
