import { StateSwitcherProps } from "./StateSwitcher.props";
import styles from "./StateSwitcher.module.scss";
import { StateSwitcherItem } from ".";
import { useState } from "react";

export function StateSwitcher<T>(props: StateSwitcherProps<T>) {
    const [selectedTaskState, setSelectedTaskState] = useState<StateSwitcherItem<T> | undefined>(
        (props.defaultState && props.list.find(({ state }) => state === props.defaultState)) || undefined
    );

    function onSelect(item: StateSwitcherItem<T> | undefined) {
        setSelectedTaskState(item);
        if (props.onSelectItem) props.onSelectItem(item);
    }

    return (
        <ul className={[styles.statesList, props.wrapperClassName].join(" ")}>
            <li
                className={(selectedTaskState === undefined && styles.selected) || ""}
                onClick={() => onSelect(undefined)}
            >
                Все
            </li>

            {props.list.map((item, index) => (
                <li
                    className={(selectedTaskState?.state === item.state && styles.selected) || ""}
                    key={`${props.keyText}__${item.state}__${index}`}
                    onClick={() => onSelect(item)}
                >
                    {item.text}
                </li>
            ))}
        </ul>
    );
}
