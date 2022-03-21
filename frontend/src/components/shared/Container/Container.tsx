import styles from "./Container.module.scss";
import { ContainerProps } from "./ContainerProps";

function Container(props: ContainerProps) {
    return (
        <div className={[styles.container, props.className].join(" ").trim()}>{props.children}</div>
    );
}

export { Container };
