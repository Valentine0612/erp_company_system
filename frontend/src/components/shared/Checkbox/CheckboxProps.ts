import { ReactNode } from "react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string | (() => string) | ReactNode | (() => ReactNode);
    wrapperClassName?: string;
    labelClassName?: string;
    className?: undefined;
    labelInvisible?: boolean;
    type?: "checkbox";
}
