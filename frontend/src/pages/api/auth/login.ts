import { NextApiRequest, NextApiResponse } from "next";
import { AuthLoginAPIData } from "api/AuthAPI";
import { BackendAuthAPI } from "api/BackendAuthAPI";
import { NextAPIUtils } from "utils/NextAPIUtils";

export default async function nextApiLogin(req: NextApiRequest, res: NextApiResponse) {
    const allowedRequestMethods: Array<string> = ["POST"];

    if (!NextAPIUtils.isRequestMethodAllowed(req, res, allowedRequestMethods)) {
        return NextAPIUtils.setRequestMethodNotAllowed(req, res, allowedRequestMethods);
    }

    try {
        const apiRes = await BackendAuthAPI.login(req.body);

        if (apiRes.status === 200) {
            res.setHeader("Set-Cookie", [
                NextAPIUtils.serializeAccessCookie((apiRes.data as AuthLoginAPIData).access),
                NextAPIUtils.serializeRefreshCookie((apiRes.data as AuthLoginAPIData).refresh),
            ]);

            return res.status(200).json({});
        }

        if (apiRes.status === 401) {
            NextAPIUtils.removeCookie(res, ["access", "refresh"]);
            return res.status(401).json(apiRes.data);
        }

        return res.status(apiRes.status).json({
            error: apiRes.data.error,
        });
    } catch (error) {
        console.log(error);
        return NextAPIUtils.setIternalServerError(req, res);
    }
}
