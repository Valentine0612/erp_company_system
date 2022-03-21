import { AlertionsType } from "types/AlertionsType";

export type AlertionState = {
    message: string;
    showTime: number;
    isShown: boolean;
    type: AlertionsType;
};

export const defaultAlertionState: AlertionState = {
    message: "",
    showTime: 0,
    isShown: false,
    type: "success",
};
