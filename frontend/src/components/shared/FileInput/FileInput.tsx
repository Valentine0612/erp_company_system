import { FileInputProps } from "./FileInputProps";
import styles from "./FileInput.module.scss";
import React, { useRef, useState } from "react";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { useDispatch } from "react-redux";

function FileInput(
    { className, error, onChange, ...otherProps }: FileInputProps,
    ref: React.ForwardedRef<HTMLInputElement>
) {
    const [fileName, setFileName] = useState("");
    const [dragged, setDragged] = useState(false);

    const inputRef = useRef<HTMLInputElement>();
    const dispatch = useDispatch();

    function setInputFileList(files: FileList) {
        if (inputRef.current) {
            const nativeInputFilesSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "files"
            )?.set;
            nativeInputFilesSetter?.call(inputRef.current, files);

            const ev2 = new Event("change", { bubbles: true });
            inputRef.current.dispatchEvent(ev2);
        }
    }

    function onDrop(event: React.DragEvent<Element>) {
        event.preventDefault();
        event.stopPropagation();
        setDragged(false);

        if (!(event.dataTransfer.files && event.dataTransfer.files[0])) {
            setFileName("");
            setInputFileList(new DataTransfer().files);
            dispatch(AlertionActionCreator.createAlerion("Непередан файл", "error"));
            return;
        }

        const fileName = event.dataTransfer.files[0].name;
        const fileType = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();

        if (otherProps.accept && !otherProps.accept?.split(",").find((acceptedType) => acceptedType === fileType)) {
            setFileName("");
            setInputFileList(new DataTransfer().files);

            dispatch(
                AlertionActionCreator.createAlerion(
                    "Неразрешенный формат файла. Разрешены: " + otherProps.accept?.split(",").join(", "),
                    "error"
                )
            );
            return;
        }

        setFileName(event.dataTransfer.files[0].name);
        setInputFileList(event.dataTransfer.files);
        if (otherProps.onDrop) otherProps.onDrop(event);
    }

    function onDragEnter(event: React.DragEvent<Element>) {
        event.preventDefault();
        event.stopPropagation();
        setDragged(true);
    }

    function onDragLeave(event: React.DragEvent<Element>) {
        event.preventDefault();
        event.stopPropagation();
        setDragged(false);
    }

    function onDragOver(event: React.DragEvent<Element>) {
        event.stopPropagation();
        event.preventDefault();
        setDragged(true);
    }

    return (
        <label
            htmlFor={otherProps.id}
            className={[styles.wrapper, (dragged && styles.dragged) || "", (error && styles.error) || "", className]
                .join(" ")
                .trim()}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <span>
                {(fileName && fileName.slice(0, 20) + (fileName.length >= 20 ? "..." : "")) || otherProps.placeholder}
            </span>
            <input
                ref={(node) => {
                    if (!node) return;
                    inputRef.current = node;
                    if (typeof ref === "function") {
                        ref(node);
                    } else if (ref) {
                        (ref as React.MutableRefObject<HTMLDivElement>).current = node;
                    }
                }}
                className={[styles.input].join(" ").trim()}
                {...otherProps}
                type="file"
                onChange={(event) => {
                    if (event.target.files && event.target.files[0]) setFileName(event.target.files[0].name);
                    else setFileName("");

                    if (onChange) onChange(event);
                }}
            />
        </label>
    );
}

const FileInputComponent = React.forwardRef(FileInput);

export { FileInputComponent as FileInput };
