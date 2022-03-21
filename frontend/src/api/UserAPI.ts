import axios, { AxiosError, AxiosResponse } from "axios";
import { IncomingMessage } from "http";
import { NextApiRequest } from "next";
import { Pagination, PaginationAPIFilter } from "types/Pagination";
import { User } from "types/User";
import { NextAPIUtils } from "utils/NextAPIUtils";

export const UserAPI = {
    getCurrenUserInfo,
    updateUserInfo,
    updateUserPassword,
    getUsersByStaff,
    getUserWithIdByStaff,
    verifyUser,
    createUserComment,
    deleteUserComment,
};

function getCurrenUserInfo(req?: NextApiRequest | IncomingMessage) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .get(process.env.DJANGO_URL + "/main/user/", { headers: defaultHeaders })
        .then((res: AxiosResponse<UserInfoAPIData>) => res)
        .catch((err: AxiosError) => err.response as AxiosResponse);
}

function updateUserInfo(data: UpdateUserInfoData, req?: NextApiRequest | IncomingMessage) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);
    const formData = NextAPIUtils.createFormData(data);

    return axios
        .patch(process.env.DJANGO_URL + "/main/user/update/", formData, { headers: defaultHeaders })
        .then((res: AxiosResponse<object>) => res)
        .catch((err: AxiosError) => err.response as AxiosResponse);
}

function updateUserPassword(data: UpdateUserPasswordData, req?: NextApiRequest | IncomingMessage) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .put(process.env.DJANGO_URL + "/main/user/change_password/", data, { headers: defaultHeaders })
        .then((res: AxiosResponse<object>) => res)
        .catch((err: AxiosError) => err.response as AxiosResponse);
}

function getUsersByStaff(
    config?: { is_verified?: boolean; pagination?: PaginationAPIFilter },
    req?: NextApiRequest | IncomingMessage
) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    let isVerified = undefined;

    if (config?.is_verified === true) isVerified = "True";
    if (config?.is_verified === false) isVerified = "False";

    return axios
        .get(process.env.DJANGO_URL + `/main/users/`, {
            headers: defaultHeaders,
            params: { ...config?.pagination, is_verified: isVerified },
        })
        .then((res: AxiosResponse<UserAPIGetUsersByStaffData>) => res)
        .catch((err: AxiosError<UserAPIGetUsersByStaffData>) => err.response as AxiosResponse);
}

function getUserWithIdByStaff(id: number, req?: IncomingMessage | NextApiRequest) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .get(process.env.DJANGO_URL + `/main/users/${id}/`, { headers: defaultHeaders })
        .then((res: AxiosResponse<UserAPIGetgetUserWithIdByStaffData>) => res)
        .catch((err: AxiosError<UserAPIGetgetUserWithIdByStaffData>) => err.response as AxiosResponse);
}

function verifyUser(id: number, req?: IncomingMessage | NextApiRequest) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .patch(process.env.DJANGO_URL + `/main/users/${id}/`, { is_verified: true }, { headers: defaultHeaders })
        .then((res: AxiosResponse<object>) => res)
        .catch((err: AxiosError<object>) => err.response as AxiosResponse);
}

function createUserComment(data: CommentUserData, userID: number, req?: NextApiRequest | IncomingMessage) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .post(process.env.DJANGO_URL + `/main/company/users/${userID}/comment/`, data, {
            headers: defaultHeaders,
        })
        .then((res: AxiosResponse<object>) => res)
        .catch((err: AxiosError) => err.response as AxiosResponse);
}

function deleteUserComment(commentID: number, req?: IncomingMessage | NextApiRequest) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .delete(process.env.DJANGO_URL + `/main/company/users/comment/${commentID}/`, { headers: defaultHeaders })
        .then((res: AxiosResponse<undefined>) => res)
        .catch((err: AxiosError<undefined>) => err.response as AxiosResponse);
}

export type UserAPIGetUsersByStaffData = Pagination<Omit<User, "login" | "profile" | "company" | "type">>;
export type UserAPIGetgetUserWithIdByStaffData = Omit<User, "login" | "company" | "type">;

export type UpdateUserInfoData = { avatar?: File; login: string };
export type UpdateUserPasswordData = { old_password: string; password: string; password2: string };
export type CommentUserData = { body: string };
export type UserInfoAPIData = User;
