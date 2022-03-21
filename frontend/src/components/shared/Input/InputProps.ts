import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean | undefined;
    wrapperClassName?: string;
    inputClassName?: string;
    labelClassName?: string;
    withoutLabel?: boolean;

    info?: string;

    icon?: IconProp;
    iconOnClick?: React.MouseEventHandler<SVGSVGElement>;

    className?: undefined;
}
