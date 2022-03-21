import { CodeInputProps } from "./CodeInputProps";
import styles from "./CodeInput.module.scss";
import React, { useState } from "react";
import { Input } from "components/shared/Input";

function CodeInput(
    { onChange, length, inputClassName, wrapperClassName, ...otherProps }: CodeInputProps,
    ref: React.ForwardedRef<HTMLInputElement>
) {
    const [inputValue, setInputValue] = useState<string>("\u25CB".repeat(length));

    return (
        <Input
            ref={ref}
            value={inputValue}
            {...otherProps}
            wrapperClassName={[styles.wrapper, wrapperClassName].join(" ").trim()}
            inputClassName={[styles.input, inputClassName].join(" ").trim()}
            onChange={(event) => {
                const isChangedNotFirtsChar = (event.target.selectionStart || 0) - 2 >= 0;
                const moveCaret =
                    isChangedNotFirtsChar && event.target.value[(event.target.selectionStart || 0) - 2] === "\u25CB";

                let newValue = event.target.value.replaceAll("\u25CB", "").slice(0, 6);
                const caretPosition = moveCaret ? newValue.length : event.target.selectionStart;

                window.requestAnimationFrame(() => {
                    event.target.setSelectionRange(caretPosition, caretPosition);
                });

                newValue += "\u25CB".repeat(length - newValue.length);

                setInputValue(newValue);

                event.target.value = newValue;
                if (onChange) onChange(event);
            }}
        />
    );
}

const CodeInputComponent = React.forwardRef(CodeInput);

export { CodeInputComponent };
