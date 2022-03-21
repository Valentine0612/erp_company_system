import styles from "./Button.module.scss";
import { ButtonProps } from "./ButtonProps";

function Button(props: ButtonProps) {
    const { className, withoutStyles, children, styleType, ...otherProps } = props;

    let selectedStyleType = styles.defaultButton;
    if (styleType === "red") selectedStyleType = styles.redButton;
    if (styleType === "white") selectedStyleType = styles.whiteButton;

    return (
        <button className={[(!withoutStyles && selectedStyleType) || "", className].join(" ").trim()} {...otherProps}>
            {children}
        </button>
    );
}

export { Button };
