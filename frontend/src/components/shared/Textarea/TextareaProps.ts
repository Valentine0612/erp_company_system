export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean | undefined;
    wrapperClassName?: string;
    textareaClassName?: string;
    labelClassName?: string;
    withoutLabel?: boolean;

    className?: undefined;
}
