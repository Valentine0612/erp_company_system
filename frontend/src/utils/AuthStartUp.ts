import { NextPageContext } from "next";
import cookie from "cookie";
import { Action, AnyAction, Store } from "redux";
import { IState } from "store";
import { UserAPI } from "api/UserAPI";
import { NextAPIUtils } from "./NextAPIUtils";
import { BackendAuthAPI } from "api/BackendAuthAPI";
import { ThunkDispatch } from "redux-thunk";
import { UserActionCreator } from "store/actionCreators/UserActionCreator";

export const AuthStartUp = async (store: Store<IState, AnyAction>, { req, res }: NextPageContext) => {
    const refresh = cookie.parse(req?.headers.cookie || "").refresh || "";

    if (!refresh) return;

    const apiResRefresh = await BackendAuthAPI.refreshToken({ refresh });

    if (!apiResRefresh) return;

    if (apiResRefresh.status === 401) {
        res?.setHeader("Set-Cookie", "");
        return;
    }

    if (apiResRefresh.status !== 200) return;

    res?.setHeader("Set-Cookie", [NextAPIUtils.serializeAccessCookie(apiResRefresh.data.access)]);

    const apiResUserInfo = await UserAPI.getCurrenUserInfo(req);

    if (apiResUserInfo.status !== 200) return;

    (store.dispatch as ThunkDispatch<IState, object, Action>)(UserActionCreator.authSuccessed(apiResUserInfo.data));
};
