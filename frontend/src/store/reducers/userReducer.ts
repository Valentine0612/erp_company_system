import { AnyAction } from "redux";
import { UserActionsEnum } from "store/actions/UserActions";
import { defaultUserState, UserState } from "store/states/UserState";

export default function userReducer(state: UserState = defaultUserState, action: AnyAction) {
    switch (action.type) {
        case UserActionsEnum.AUTH_SUCCESS:
            return { ...state, isAuthenticated: true, userInfo: action.payload.user };

        case UserActionsEnum.AUTH_FAIL:
            return { ...state, isAuthenticated: false, userInfo: null };

        default:
            return state;
    }
}
