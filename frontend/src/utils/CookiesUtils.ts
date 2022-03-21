import cookie from "cookie";
import { IncomingMessage } from "http";
import Cookies from "js-cookie";
import { NextApiRequest } from "next";

export class CookiesUtils {
    public static getAccessToken(req?: NextApiRequest | IncomingMessage) {
        return cookie.parse(req?.headers?.cookie || "").access || Cookies.get("access") || "";
    }
}
