import axios, { AxiosError, AxiosResponse } from "axios";
import { OccupationTypeEnum } from "enums/OccupationTypeEnum";
import { NextAPIUtils } from "utils/NextAPIUtils";

export class AuthAPI {
    static login(data: { login: string; password: string }) {
        return axios
            .post(process.env.NEXT_URL + "/api/auth/login/", data)
            .then((res: AxiosResponse<AuthLoginAPIData>) => res)
            .catch((err: AxiosError) => err.response as AxiosResponse);
    }

    static logout() {
        return axios
            .get(process.env.NEXT_URL + "/api/auth/logout/")
            .then((res: AxiosResponse<object>) => res)
            .catch((err: AxiosError) => err.response as AxiosResponse);
    }

    static refreshToken() {
        return axios
            .get(process.env.NEXT_URL + "/api/auth/refresh/")
            .then((res: AxiosResponse<AuthRefreshTokenAPIData>) => res)
            .catch((err: AxiosError) => err.response as AxiosResponse);
    }

    static registerUploadDocument(data: registerUploadDocumentData) {
        const formData = NextAPIUtils.createFormData(data);

        return axios
            .post(process.env.DJANGO_URL + "/main/register/documents/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res: AxiosResponse<object>) => res)
            .catch((err: AxiosError) => err.response as AxiosResponse);
    }

    static resetPassword(data: { email: string }) {
        return axios
            .post(process.env.DJANGO_URL + "/password_reset/", data)
            .then((res: AxiosResponse<object>) => res)
            .catch((err: AxiosError) => err.response as AxiosResponse);
    }

    static resetPasswordConfirm(data: { password: string; token: string }) {
        return axios
            .post(process.env.DJANGO_URL + "/password_reset/confirm/", data)
            .then((res: AxiosResponse<object>) => res)
            .catch((err: AxiosError) => err.response as AxiosResponse);
    }

    static registerIPEmloyee(
        data: AuthAPIRegisterIPRequestData,
        url: string = process.env.DJANGO_URL + "/main/register/"
    ) {
        return axios
            .post(url, data)
            .then((res: AxiosResponse<AuthRefreshTokenAPIData>) => res)
            .catch((err: AxiosError) => err.response as AxiosResponse);
    }

    static registerRIGEmloyee(
        data: AuthAPIRegisterRIGRequestData,
        url: string = process.env.DJANGO_URL + "/main/register/"
    ) {
        return axios
            .post(url, data)
            .then((res: AxiosResponse<AuthRefreshTokenAPIData>) => res)
            .catch((err: AxiosError) => err.response as AxiosResponse);
    }

    static registerFLSZEmloyee(
        data: AuthAPIRegisterFLSZRequestData,
        url: string = process.env.DJANGO_URL + "/main/register/"
    ) {
        return axios
            .post(url, data)
            .then((res: AxiosResponse<AuthRefreshTokenAPIData>) => res)
            .catch((err: AxiosError) => err.response as AxiosResponse);
    }
}

type APIDataWithAccessToken = { access: string };
type APIDataWithRefreshToken = { refresh: string };
type BankdetailRegisterData = { bik: string; rs: string; ks: string };

export type AuthLoginAPIData = APIDataWithAccessToken & APIDataWithRefreshToken;
export type AuthRefreshTokenAPIData = APIDataWithAccessToken;

// ------------------------
//       Request data
// ------------------------
export type AuthAPIRegisterIPRequestData = {
    email: string;
    name: string;
    surname: string;
    patronymic: string;
    phone: string;
    profile: {
        type: OccupationTypeEnum.IP;
        place_of_issue: string;
        issued_code: string;
        passport: string;
        issued: string;
        dob: string;
        pob: string;
        registration_date: string;
        residence: string;
        ogrnip: string;
        inn: string;
        bankdetail: BankdetailRegisterData;
    };
};

export type AuthAPIRegisterRIGRequestData = {
    email: string;
    name: string;
    surname: string;
    patronymic: string;
    phone: string;
    profile: {
        type: OccupationTypeEnum.RIG;
        citizenship: string;
        passport: string;
        residence: string;
        inn: string;
        bankdetail: BankdetailRegisterData;
    };
};

export type AuthAPIRegisterFLSZRequestData = {
    email: string;
    name: string;
    surname: string;
    patronymic: string;
    phone: string;
    profile: {
        type: OccupationTypeEnum.FL | OccupationTypeEnum.SZ;
        place_of_issue: string;
        issued_code: string;
        passport: string;
        issued: string;
        dob: string;
        pob: string;
        residence: string;
        inn: string;
        snils: string;
        bankdetail: BankdetailRegisterData;
    };
};

export type registerUploadDocumentData = {
    profile: number;
    titles: Array<string>;
    image: Array<File>;
};
