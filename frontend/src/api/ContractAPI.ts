import axios, { AxiosError, AxiosResponse } from "axios";
import { IncomingMessage } from "http";
import { NextApiRequest } from "next";
import { ConfirmContractStateByEmployeeEnum } from "enums/ConfirmContractStateByEmployeeEnum";
import { CreateContractStateByManagerEnum } from "enums/CreateContractStateByManagerEnum";
import { NextAPIUtils } from "utils/NextAPIUtils";

export class ContractAPI {
    static createContractWithUserByManger(
        data: ContractAPICreateContractWithUserByMangerRequestData,
        userID: number,
        req?: NextApiRequest | IncomingMessage
    ) {
        const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

        return axios
            .post(process.env.DJANGO_URL + `/main/company/users/${userID}/contract/`, data, {
                headers: defaultHeaders,
            })
            .then((res: AxiosResponse<object>) => res)
            .catch((err: AxiosError) => err.response as AxiosResponse);
    }

    static confirmContractByEmployee(
        data: ContractAPIConfirmContractByEmployeeRequestData,
        req?: NextApiRequest | IncomingMessage
    ) {
        const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

        return axios
            .post(process.env.DJANGO_URL + "/main/user/contract/", data, {
                headers: defaultHeaders,
            })
            .then((res: AxiosResponse<object>) => res)
            .catch((err: AxiosError) => err.response as AxiosResponse);
    }
}

export type ContractAPICreateContractWithUserByMangerRequestData = {
    state: CreateContractStateByManagerEnum;
    code: string;
};

export type ContractAPIConfirmContractByEmployeeRequestData = {
    state: ConfirmContractStateByEmployeeEnum;
    code: string;
    company: number;
};
