import { NavbarActionsEnum } from "store/actions/NavbarActions";

export const NavbarActionCreator = { openNavbar, closeNavbar };

function openNavbar() {
    return {
        type: NavbarActionsEnum.OPEN_NAVBAR,
    };
}

function closeNavbar() {
    return {
        type: NavbarActionsEnum.CLOSE_NAVBAR,
    };
}
