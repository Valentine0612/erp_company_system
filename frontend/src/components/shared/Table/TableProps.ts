import { ReactNode } from "react";

export type TableProps = {
    className?: string;
    children?: ReactNode | (() => ReactNode);
    withoutHeader?: boolean;
};
