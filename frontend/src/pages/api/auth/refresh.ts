import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { AuthRefreshTokenAPIData } from "api/AuthAPI";
import { BackendAuthAPI } from "api/BackendAuthAPI";
import { NextAPIUtils } from "utils/NextAPIUtils";

export default async function nextRefresh(req: NextApiRequest, res: NextApiResponse) {
    const allowedRequestMethods: Array<string> = ["GET"];

    if (!NextAPIUtils.isRequestMethodAllowed(req, res, allowedRequestMethods)) {
        return NextAPIUtils.setRequestMethodNotAllowed(req, res, allowedRequestMethods);
    }

    const refresh = cookie.parse(req.headers.cookie ?? "").refresh || "";

    if (!refresh) {
        return res.status(401).json({
            error: "User unauthorized to make this request",
        });
    }

    try {
        const apiRes = await BackendAuthAPI.refreshToken({ refresh });

        if (apiRes.status === 200)
            res.setHeader("Set-Cookie", [
                NextAPIUtils.serializeAccessCookie((apiRes.data as AuthRefreshTokenAPIData).access),
            ]);

        if (apiRes.status === 401) NextAPIUtils.removeCookie(res, ["access", "refresh"]);

        return res.status(apiRes.status).json(apiRes.data);
    } catch (error) {
        console.log(error);
        return NextAPIUtils.setIternalServerError(req, res);
    }
}
