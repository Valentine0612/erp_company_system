import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import cookie from "cookie";
import { IncomingMessage } from "http";
import { HeaderType } from "types/HeaderType";
import { CookiesUtils } from "./CookiesUtils";

export class NextAPIUtils {
    public static getDefaultHeader(req?: NextApiRequest | IncomingMessage) {
        const headers: HeaderType = {
            ...this.getDefaultTokenAuthorizationHeader(req),
        };

        return headers;
    }

    public static getDefaultTokenAuthorizationHeader(req?: NextApiRequest | IncomingMessage): HeaderType {
        const accessCookie = CookiesUtils.getAccessToken(req);
        return this.getTokenAuthorizationHeader(process.env.JWT_AUTH_HEADER_PREFIX || "", accessCookie);
    }

    public static getTokenAuthorizationHeader(headerPrefix?: string, token?: string): HeaderType {
        if (headerPrefix && token) return { Authorization: `${headerPrefix} ${token}` };
        else return {};
    }

    public static isRequestMethodAllowed(
        req: NextApiRequest,
        res: NextApiResponse,
        allowedRequestMethods: Array<string>
    ): boolean {
        for (const index in allowedRequestMethods) {
            if (req.method === allowedRequestMethods[index]) return true;
        }

        return false;
    }

    public static setRequestMethodNotAllowed(
        req: NextApiRequest,
        res: NextApiResponse,
        allowedRequestMethods: Array<string>
    ) {
        res.setHeader("Allow", allowedRequestMethods);
        res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
            error: `Method ${req.method} not allowed`,
        });
    }

    public static setIternalServerError(req: NextApiRequest, res: NextApiResponse) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Something went wrong when retrieving user",
        });
    }

    public static serializeAccessCookie(access: string): string {
        return cookie.serialize("access", access, {
            maxAge: 60 * 30,
            path: "/",
        });
    }

    public static serializeRefreshCookie(refresh: string): string {
        return cookie.serialize("refresh", refresh, {
            maxAge: 60 * 60 * 24 * 30,
            path: "/",
        });
    }

    public static removeCookie(res: NextApiResponse, cookies: Array<string>) {
        res.setHeader(
            "Set-Cookie",
            cookies.map((name) =>
                cookie.serialize(name, "", {
                    maxAge: -1,
                    path: "/",
                })
            )
        );
    }

    public static createFormData(data: unknown, form?: FormData, namespace = ""): FormData {
        const formData = form || new FormData();

        if (data instanceof Date && namespace) {
            console.log(`formData.append(${namespace}, ${data.toISOString()});`);
            formData.append(namespace, data.toISOString());
            return formData;
        }

        if (data instanceof File && namespace) {
            console.log(`formData.append(${namespace}, ${data}, ${data.name});`);
            formData.append(namespace, data, data.name);
            return formData;
        }

        if (data instanceof Array && namespace) {
            data.forEach((element: unknown) => {
                this.createFormData(element, formData, `${namespace}[]`);
            });
            return formData;
        }

        if (typeof data === "object") {
            for (const key in data) {
                const value = (data as { [key: string]: string | undefined })[key];
                const formKey = namespace ? `${namespace}[${key}]` : key;

                if (!Object.prototype.hasOwnProperty.call(data, key) || (!(typeof value === "boolean") && !value))
                    continue;

                this.createFormData(value, formData, formKey);
            }

            return formData;
        }

        console.log(`formData.append(${namespace}, ${data});`);
        formData.append(namespace, String(data));
        return formData;
    }
}
