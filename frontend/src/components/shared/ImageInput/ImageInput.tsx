import { ImageInputProps } from "./ImageInputProps";
import styles from "./ImageInput.module.scss";
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { useDispatch } from "react-redux";

function ImageInput(
    { className, error, onChange, defaultValue, ...otherProps }: ImageInputProps,
    ref: React.ForwardedRef<HTMLInputElement>
) {
    const [imageSrc, setImageSrc] = useState("");
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
            setImageSrc("");
            setInputFileList(new DataTransfer().files);
            dispatch(AlertionActionCreator.createAlerion("Непередан файл", "error"));
            return;
        }

        const fileName = event.dataTransfer.files[0].name;
        const fileType = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();

        if (otherProps.accept && !otherProps.accept?.split(",").find((acceptedType) => acceptedType === fileType)) {
            setImageSrc("");
            setInputFileList(new DataTransfer().files);
            dispatch(
                AlertionActionCreator.createAlerion(
                    "Неразрешенный формат файла. Разрешены: " + otherProps.accept?.split(",").join(", "),
                    "error"
                )
            );
            return;
        }

        setImageSrc(URL.createObjectURL(event.dataTransfer.files[0]));
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
    }

    function getImageUrl() {
        if (imageSrc) return `url(${imageSrc})`;
        if (defaultValue) return `url(${defaultValue})`;
        return "";
    }

    return (
        <label
            htmlFor={otherProps.id}
            className={[styles.wrapper, (error && styles.error) || "", className].join(" ").trim()}
            style={{
                backgroundImage: getImageUrl(),
            }}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <div className={[styles.iconWrapper, (dragged && styles.dragged) || ""].join(" ").trim()}>
                <FontAwesomeIcon
                    icon={faCamera}
                    className={[styles.icon, ((imageSrc || defaultValue) && styles.hidden) || ""].join(" ").trim()}
                />
            </div>

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
                    console.log("AUE", event.target.files);

                    if (event.target.files && event.target.files[0]) {
                        setImageSrc(URL.createObjectURL(event.target.files[0]));
                    } else setImageSrc("");

                    if (onChange) onChange(event);
                }}
            />
        </label>
    );
}

const ImageInputComponent = React.forwardRef(ImageInput);

export { ImageInputComponent as ImageInput };
