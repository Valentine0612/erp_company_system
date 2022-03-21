import { User } from "types/User";

export type UserState = {
    userInfo: User | null;
    isAuthenticated: boolean;
};

export const defaultUserState: UserState = {
    userInfo: null,
    isAuthenticated: false,
};
