import axios, { AxiosError, AxiosResponse } from "axios";
import { IncomingMessage } from "http";
import { NextApiRequest } from "next";
import { NextAPIUtils } from "utils/NextAPIUtils";

export const CheckAPI = {
    checkEmailExists,
};

function checkEmailExists(email: string, req?: NextApiRequest | IncomingMessage) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .post(process.env.DJANGO_URL + "/main/check_email/", { email }, { headers: defaultHeaders })
        .then((res: AxiosResponse<object>) => res)
        .catch((err: AxiosError) => err.response as AxiosResponse);
}
