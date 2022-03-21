import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { NextAPIUtils } from "utils/NextAPIUtils";

export default async function nextApiLogout(req: NextApiRequest, res: NextApiResponse) {
    const allowedRequestMethods: Array<string> = ["GET"];

    if (!NextAPIUtils.isRequestMethodAllowed(req, res, allowedRequestMethods)) {
        return NextAPIUtils.setRequestMethodNotAllowed(req, res, allowedRequestMethods);
    }

    const cookies = cookie.parse(req.headers.cookie ?? "");
    const refresh = cookies.refresh || "";

    if (!refresh) {
        return res.status(401).json({
            error: "User unauthorized to make this request",
        });
    }

    try {
        NextAPIUtils.removeCookie(res, ["access", "refresh"]);
        return res.status(200).json({});
    } catch (error) {
        console.log(error);
        return NextAPIUtils.setIternalServerError(req, res);
    }
}
