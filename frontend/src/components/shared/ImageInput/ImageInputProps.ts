import { DragEventHandler } from "react";

export interface ImageInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean | undefined;
    type?: "file";
    className?: string;
    onDrop?: DragEventHandler<Element>;
    multiple?: false;
    defaultValue?: string;
}
