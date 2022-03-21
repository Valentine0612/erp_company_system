import { SelectorProps } from "./SelectorProps";
import styles from "./Selector.module.scss";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { MapType } from "types/MapType";

const Selector = <ChildType extends MapType>(props: SelectorProps<ChildType>) => {
    const [isOpened, setIsOpened] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ChildType | undefined>(props.defaultValue || undefined);

    return (
        <div
            className={[
                props.className,
                styles.wrapper,
                props.hidden ? styles.hiddenSeletor : "",
                props.error ? styles.error : "",
            ]
                .join(" ")
                .trim()}
        >
            <div
                className={[styles.select, !isOpened ? styles.selectClosed : ""].join(" ").trim()}
                onClick={() => {
                    setIsOpened(!isOpened);
                }}
            >
                <span>
                    {selectedItem && props.textKeyName in selectedItem
                        ? selectedItem[props.textKeyName]
                        : props.defaultText || "Unknown name"}
                </span>
                <FontAwesomeIcon
                    icon={faAngleDown}
                    className={[styles.arrowIcon, !isOpened ? styles.arrowIconClosed : ""].join(" ").trim()}
                />
            </div>

            <ul
                className={[
                    styles.optionsBlock,
                    (!isOpened && styles.optionsBlockClosed) || "",
                    (props.absolutePositionItems && styles.absolutePosition) || "",
                ]
                    .join(" ")
                    .trim()}
            >
                {props.options.map((optionItem, index) => (
                    <li
                        className={styles.option}
                        key={props.keyValue + index}
                        onClick={() => {
                            if (props.onSelect) props.onSelect(optionItem);
                            setIsOpened(false);
                            setSelectedItem(optionItem);
                        }}
                    >
                        {props.textKeyName in optionItem ? optionItem[props.textKeyName] : "Unknown name"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export { Selector };
