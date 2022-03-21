import { CardProps } from "./CardProps";
import styles from "./Card.module.scss";

export const Card = (props: CardProps) => {
    return (
        <div
            className={[styles.card, props.transparent && styles.transparent, props.className]
                .join(" ")
                .trim()}
        >
            {props.children}
        </div>
    );
};
