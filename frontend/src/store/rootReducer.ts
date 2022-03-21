import { HYDRATE } from "next-redux-wrapper";
import { AnyAction, combineReducers } from "redux";
import alertionReducer from "./reducers/alertionReducer";
import navbarReducer from "./reducers/navbarReducer";
import popupReducer from "./reducers/popupReducer";
import userReducer from "./reducers/userReducer";
import { AlertionState, defaultAlertionState } from "./states/AlertionState";
import { defaultNavbarState, NavbarState } from "./states/NavbarState";
import { defaultPopupState, PopupState } from "./states/PopupState";
import { defaultUserState, UserState } from "./states/UserState";

export interface IState {
    user: UserState;
    navbar: NavbarState;
    popup: PopupState;
    alertion: AlertionState;
}

export const initialState: IState = {
    user: defaultUserState,
    navbar: defaultNavbarState,
    popup: defaultPopupState,
    alertion: defaultAlertionState,
};

export const rootReducer = (state: IState | undefined, action: AnyAction) => {
    if (action.type === HYDRATE)
        return {
            ...state,
            ...action.payload,
        };

    return combineReducers({
        user: userReducer,
        navbar: navbarReducer,
        popup: popupReducer,
        alertion: alertionReducer,
    })(state, action);
};
