import React, { ChangeEvent, useState } from "react";
import { DaDataSearchInputProps } from ".";
import { Input } from "components/shared/Input";
import styles from "./DaDataSearchInput.module.scss";

const DaDataSearchInput = <T extends object>(props: DaDataSearchInputProps<T>) => {
    const [queryText, setQueryText] = useState<string>(props.defaultText || "");
    const [items, setItems] = useState<Array<T>>([]);
    const [isSelectorShown, setIsSelectorShown] = useState<boolean>(false);
    const [dontBlur, setDontBlur] = useState<boolean>(false);

    const getIsSelectorShown = () =>
        Boolean(
            isSelectorShown && queryText.length && (items.length || props.onUnfoundClick || props.unfoundClickText)
        );

    async function searchItems(query: string) {
        setItems((props.searchItems && (await props.searchItems(query))) || []);
    }

    const inputClassName = [styles.input, getIsSelectorShown() && styles.withShownSelector].join(" ");
    const itemsBlockClassName = [styles.resultsBlock, !getIsSelectorShown() && styles.hidden].join(" ");
    const unfoundButtonClassName = [styles.result, styles.unfoundButton].join(" ");

    const inputOnFocus = () => setIsSelectorShown(true);
    const inputOnBlur = () => !dontBlur && setIsSelectorShown(false);
    const inputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        searchItems(event.target.value);
        setQueryText(event.target.value);
    };

    const itemsBlockOnMouseEnter = () => setDontBlur(true);
    const itemsBlockOnMouseLeave = () => setDontBlur(false);

    const itemOnClick = (item: T) => {
        setIsSelectorShown(false);
        if (props.saveInputValueAfterSelect) setQueryText(props.saveInputValueAfterSelect(item));
        if (props.onSelect) props.onSelect(item);
    };

    const unfoundButtonOnClick = () => {
        if (props.onUnfoundClick) {
            setIsSelectorShown(false);
            props.onUnfoundClick();
        }
    };

    return (
        <div className={props.wrapperClassName}>
            <Input
                id={props.id}
                placeholder={props.placeholder}
                inputClassName={inputClassName}
                value={queryText}
                error={props.error}
                onBlur={inputOnBlur}
                onFocus={inputOnFocus}
                onChange={inputOnChange}
            />

            <div
                className={itemsBlockClassName}
                onMouseEnter={itemsBlockOnMouseEnter}
                onMouseLeave={itemsBlockOnMouseLeave}
            >
                {items.length
                    ? items.map((item, index) => (
                          <div
                              key={props.itemKey + "__" + index}
                              className={styles.result}
                              onClick={() => itemOnClick(item)}
                          >
                              {props.itemComponent && props.itemComponent(item)}
                          </div>
                      ))
                    : (props.onUnfoundClick || props.unfoundClickText) &&
                      Boolean(queryText.length) && (
                          <div className={unfoundButtonClassName} onClick={unfoundButtonOnClick}>
                              {props.unfoundClickText || "unfoundClickText"}
                          </div>
                      )}
            </div>
        </div>
    );
};

export { DaDataSearchInput };
