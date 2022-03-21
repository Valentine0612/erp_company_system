import axios, { AxiosError, AxiosResponse } from "axios";

export const BackendAuthAPI = {
    login,
    refreshToken,
};

function login(data: { login: string; password: string }) {
    return axios
        .post(process.env.DJANGO_URL + "/token/", data)
        .then((res: AxiosResponse<{}>) => res)
        .catch((err: AxiosError) => err.response as AxiosResponse);
}

function refreshToken(data: { refresh: string }) {
    return axios
        .post(process.env.DJANGO_URL + "/token/refresh/", data)
        .then((res: AxiosResponse<{}>) => res)
        .catch((err: AxiosError) => err.response as AxiosResponse);
}
