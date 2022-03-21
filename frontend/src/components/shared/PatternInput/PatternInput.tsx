import { PatternInputProps } from "./PatternInputProps";
// import styles from "./PatternInput.module.scss";
import React, { useEffect, useState } from "react";
import { Input } from "components/shared/Input";

function PatternInput(
    { onChange, pattern, defaultValue, ...otherProps }: PatternInputProps,
    ref: React.ForwardedRef<HTMLInputElement>
) {
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
    const [inputValue, setInputValue] = useState<string>(createDefaultValue() || "");

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return setInputValue(createDefaultValue() || pattern);
        }

        setInputValue(pattern);
    }, [pattern]);

    function createDefaultValue() {
        if (!defaultValue) return undefined;

        let newValue = pattern;
        String(defaultValue)
            .split("")
            .forEach((symbol) => {
                newValue = newValue.replace("_", symbol);
            });

        return newValue;
    }

    return (
        <Input
            onChange={(event) => {
                const newValue = event.target.value;
                const patternDigits = pattern.replaceAll(/\D+/g, "");
                const newValueDigits = newValue.replaceAll(/\D+/g, "");

                let resultValue = pattern;

                newValueDigits
                    .replace(patternDigits, "")
                    .split("")
                    .forEach((item) => {
                        resultValue = resultValue.replace(/_/, item);
                    });

                const selectionStart = event.target.selectionStart || resultValue.length;
                const caret =
                    selectionStart +
                    (resultValue.slice(selectionStart).search(/[\d_]/) > 0
                        ? resultValue.slice(selectionStart).search(/[\d_]/)
                        : 0);

                setInputValue(resultValue);

                window.requestAnimationFrame(() => {
                    event.target.setSelectionRange(caret, caret);
                });

                event.target.value = resultValue;
                if (onChange) onChange(event);
            }}
            ref={ref}
            {...otherProps}
            value={inputValue}
        />
    );
}

const PatternInputComponent = React.forwardRef(PatternInput);

export { PatternInputComponent };
