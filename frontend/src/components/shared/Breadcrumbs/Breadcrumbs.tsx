import { BreadcrumbsProps } from "./Breadcrumbs.props";
import styles from "./Breadcrumbs.module.scss";

function Breadcrumbs(props: BreadcrumbsProps) {
    return (
        <div className={[styles.breadcrumbs, props.className].join(" ").trim()}>
            {props.list.map((item, index) => (
                <a href={item.url} key={`Breadcrumbs_item_${index}`} className={styles.breadcrumbsItem}>
                    {item.text.length > 30 ? item.text.slice(0, 30).trim() + "..." : item.text}
                </a>
            ))}
        </div>
    );
}

export { Breadcrumbs };
