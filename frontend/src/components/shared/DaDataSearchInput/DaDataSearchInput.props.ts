import { ReactNode } from "react";

export type DaDataSearchInputProps<T extends object> = {
    onSelect?: (item: T) => void;
    onUnfoundClick?: () => void;
    unfoundClickText?: string;

    searchItems?: (query: string) => Promise<Array<T>>;
    itemKey?: string;
    itemComponent?: (item: T) => ReactNode;

    id?: string;
    placeholder?: string;
    error?: boolean | undefined;

    defaultText?: string;

    wrapperClassName?: string;
    saveInputValueAfterSelect?: (item: T) => string;
};
