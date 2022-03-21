import { ReactNode } from "react";

export interface ContainerProps {
    children?: ReactNode | (() => ReactNode);
    className?: string;
}
