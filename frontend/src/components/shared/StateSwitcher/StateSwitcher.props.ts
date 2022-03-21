import { StateSwitcherItem } from ".";

export type StateSwitcherProps<T = string> = {
    list: Array<StateSwitcherItem<T>>;
    keyText: string;
    defaultState?: T;

    wrapperClassName?: string;
    onSelectItem?: (item: StateSwitcherItem<T> | undefined) => void;
};
