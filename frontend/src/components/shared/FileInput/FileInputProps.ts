import { DragEventHandler } from "react";

export type FileInputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "error" | "type" | "onDrop" | "multiple" | "setValue" | "clearErrors"
> & {
    error?: boolean | undefined;
    type?: "file";
    onDrop?: DragEventHandler<Element>;
    multiple?: false;
};
