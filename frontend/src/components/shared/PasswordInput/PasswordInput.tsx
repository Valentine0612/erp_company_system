import { PasswordInputProps } from "./PasswordInputProps";
import React, { useState } from "react";
import { Input } from "components/shared/Input";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function PasswordInput({ onChange, ...otherProps }: PasswordInputProps, ref: React.ForwardedRef<HTMLInputElement>) {
    const [isShown, setIsShown] = useState<boolean>(false);

    return (
        <Input
            onChange={(event) => {
                if (onChange) onChange(event);
            }}
            iconOnClick={() => setIsShown(!isShown)}
            ref={ref}
            {...otherProps}
            type={isShown ? "text" : "password"}
            icon={isShown ? faEyeSlash : faEye}
        />
    );
}

const PasswordInputComponent = React.forwardRef(PasswordInput);

export { PasswordInputComponent };
