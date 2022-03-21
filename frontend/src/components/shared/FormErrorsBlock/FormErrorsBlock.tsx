import { FormErrorsBlockProps } from "./FormErrorsBlockProps";
import styles from "./FormErrorsBlock.module.scss";

function FormErrorsBlock(props: FormErrorsBlockProps) {
    return (
        <div
            className={[
                styles.errorsBlock,
                props.className,
                Object.entries(props.errors).length === 0 ? styles.errorsBlock__hidden : "",
            ]
                .join(" ")
                .trim()}
        >
            {Object.entries(props.errors).map(
                (error: [string, { type: string; message: string }], index) => (
                    <p key={"formErrorsBlock__errorItem__" + index}>{error[1].message}</p>
                )
            )}
        </div>
    );
}

export { FormErrorsBlock };
