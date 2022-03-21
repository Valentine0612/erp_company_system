import { AlertionsType } from "types/AlertionsType";
import { AlertionActionsEnum } from "store/actions/AlertionActions";

export const AlertionActionCreator = {
    createAlerion,
    closeAlerion,
};

function createAlerion(message: string, type: AlertionsType = "success", showTime: number = 3000) {
    return {
        type: AlertionActionsEnum.CREATE_ALERTION,
        payload: {
            message,
            type,
            showTime,
        },
    };
}

function closeAlerion() {
    return {
        type: AlertionActionsEnum.CLOSE_ALERTION,
        payload: {},
    };
}
