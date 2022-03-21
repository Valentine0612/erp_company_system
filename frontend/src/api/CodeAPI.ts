import axios, { AxiosError, AxiosResponse } from "axios";
import { IncomingMessage } from "http";
import { NextApiRequest } from "next";
import { NextAPIUtils } from "utils/NextAPIUtils";

export const CodeAPI = {
    sendOTPCodeOnEmail,
};

function sendOTPCodeOnEmail(req?: NextApiRequest | IncomingMessage) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .get(process.env.DJANGO_URL + "/main/confirm/", { headers: defaultHeaders })
        .then((res: AxiosResponse<object>) => res)
        .catch((err: AxiosError) => err.response as AxiosResponse);
}
