import { AnyAction } from "redux";
import { NavbarActionsEnum } from "store/actions/NavbarActions";
import { defaultNavbarState, NavbarState } from "store/states/NavbarState";

export default function navbarReducer(state: NavbarState = defaultNavbarState, action: AnyAction): NavbarState {
    switch (action.type) {
        case NavbarActionsEnum.OPEN_NAVBAR:
            return { ...state, isOpen: true };

        case NavbarActionsEnum.CLOSE_NAVBAR:
            return { ...state, isOpen: false };

        default:
            return state;
    }
}
