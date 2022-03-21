import { ReactNode } from "react";

export type CardProps = {
    className?: string;
    transparent?: boolean;
    children?: ReactNode | (() => ReactNode);
};
