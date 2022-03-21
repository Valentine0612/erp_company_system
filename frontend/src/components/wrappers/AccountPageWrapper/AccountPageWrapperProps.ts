import { ReactNode } from "react";
import { NavbarItem } from "types/NavbarItem";

export interface AccountPageWrapperProps {
    children?: ReactNode | (() => ReactNode);
    navbarList?: Array<NavbarItem>;
}
