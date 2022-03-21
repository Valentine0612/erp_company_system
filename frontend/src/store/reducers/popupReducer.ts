import { AnyAction } from "redux";
import { PopupActionsEnum } from "store/actions/PopupActions";
import { defaultPopupState, PopupState } from "store/states/PopupState";

export default function popupReducer(state: PopupState = defaultPopupState, action: AnyAction): PopupState {
    switch (action.type) {
        case PopupActionsEnum.OPEN_POPUP:
            return {
                ...state,
                isOpen: true,
                name: action.payload.name,
                data: action.payload.data,
            };

        case PopupActionsEnum.CLOSE_POPUP:
            return { ...state, isOpen: false, name: null };

        default:
            return state;
    }
}
