import { InputProps } from "./InputProps";
import styles from "./Input.module.scss";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

function Input(
    {
        wrapperClassName,
        inputClassName,
        className,
        labelClassName,
        error,
        withoutLabel,
        icon,
        iconOnClick,
        info,
        ...otherProps
    }: InputProps,
    ref: React.ForwardedRef<HTMLInputElement>
) {
    return (
        <div className={[styles.wrapper, error && styles.error, wrapperClassName].join(" ").trim()}>
            {!withoutLabel && (
                <label htmlFor={otherProps.id} className={[styles.label, labelClassName].join(" ").trim()}>
                    {otherProps.placeholder}
                </label>
            )}

            <input
                ref={ref}
                className={[
                    styles.input,
                    (withoutLabel && styles.inputWithoutLabel) || "",
                    (icon && styles.inputWithIcon) || "",
                    (otherProps.disabled && styles.disabled) || "",
                    inputClassName,
                    className,
                ]
                    .join(" ")
                    .trim()}
                {...otherProps}
            />

            {icon && (
                <FontAwesomeIcon
                    icon={icon}
                    className={[styles.icon, iconOnClick && styles.clickable].join(" ").trim()}
                    onClick={iconOnClick}
                />
            )}

            {info && (
                <div className={styles.infoBlock}>
                    <FontAwesomeIcon icon={faEllipsis} className={styles.infoIcon} onClick={iconOnClick} />
                    <span>{info}</span>
                </div>
            )}
        </div>
    );
}

const InputComponent = React.forwardRef(Input);

export { InputComponent };
