import { AnyAction } from "redux";
import { AlertionActionsEnum } from "store/actions/AlertionActions";
import { defaultAlertionState, AlertionState } from "store/states/AlertionState";

export default function alertionReducer(state: AlertionState = defaultAlertionState, action: AnyAction): AlertionState {
    switch (action.type) {
        case AlertionActionsEnum.CREATE_ALERTION:
            return {
                ...state,
                isShown: true,
                message: action.payload.message,
                type: action.payload.type,
                showTime: action.payload.showTime,
            };

        case AlertionActionsEnum.CLOSE_ALERTION:
            return {
                ...state,
                isShown: false,
            };

        default:
            return state;
    }
}
