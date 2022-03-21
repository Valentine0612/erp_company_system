import { MapType } from "types/MapType";

export interface SelectorProps<T extends MapType> {
    className?: string;
    defaultText?: string;
    keyValue: string;
    options: Array<T>;
    textKeyName: string;
    onSelect?: (item: T) => void;
    defaultValue?: T;

    error?: boolean;
    hidden?: boolean;
    absolutePositionItems?: boolean;
}
