import { User } from "types/User";
import { UserActionsEnum } from "store/actions/UserActions";

export const UserActionCreator = { authSuccessed, authFailed };

function authSuccessed(user: User) {
    return {
        type: UserActionsEnum.AUTH_SUCCESS,
        payload: { user },
    };
}

function authFailed() {
    return { type: UserActionsEnum.AUTH_FAIL };
}
