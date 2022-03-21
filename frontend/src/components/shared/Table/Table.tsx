import { TableProps } from "./TableProps";
import styles from "./Table.module.scss";
import { Card } from "components/shared/Card";

export const Table = (props: TableProps) => {
    return (
        <Card
            className={[(!props.withoutHeader && styles.withHeader) || "", props.className, styles.table]
                .join(" ")
                .trim()}
        >
            {props.children}
        </Card>
    );
};
