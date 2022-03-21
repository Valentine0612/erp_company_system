import axios, { AxiosError, AxiosResponse } from "axios";
import { DaDataBank, DaDataCompany, DaDataPassportIssuePlace } from "types/DaDataTypes";
import { NextAPIUtils } from "utils/NextAPIUtils";

export class DaDataAPI {
    public static searchCompanies(query: string, count?: string) {
        const headers = {
            ...NextAPIUtils.getDefaultHeader(),
            ...NextAPIUtils.getTokenAuthorizationHeader("Token", process.env.DADATA_API_KEY || ""),
        };

        return axios
            .post("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party", { query, count }, { headers })
            .then((res: AxiosResponse<DaDataAPISearchCompaniesResponseData>) => res)
            .catch((err: AxiosError<DaDataAPISearchCompaniesResponseData>) => err.response as AxiosResponse);
    }

    public static searchBanks(query: string, count?: string) {
        const headers = {
            ...NextAPIUtils.getDefaultHeader(),
            ...NextAPIUtils.getTokenAuthorizationHeader("Token", process.env.DADATA_API_KEY || ""),
        };

        return axios
            .post("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/bank", { query, count }, { headers })
            .then((res: AxiosResponse<DaDataAPISearchBanksResponseData>) => res)
            .catch((err: AxiosError<DaDataAPISearchBanksResponseData>) => err.response as AxiosResponse);
    }

    public static searchPassportIssuePlace(query: string, count?: string) {
        const headers = {
            ...NextAPIUtils.getDefaultHeader(),
            ...NextAPIUtils.getTokenAuthorizationHeader("Token", process.env.DADATA_API_KEY || ""),
        };

        return axios
            .post(
                "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fms_unit",
                { query, count },
                { headers }
            )
            .then((res: AxiosResponse<DaDataAPISearchPassportIssuePlaceResponseData>) => res)
            .catch((err: AxiosError<DaDataAPISearchPassportIssuePlaceResponseData>) => err.response as AxiosResponse);
    }
}

export type DaDataAPISearchCompaniesResponseData = { suggestions: Array<DaDataCompany> };
export type DaDataAPISearchBanksResponseData = { suggestions: Array<DaDataBank> };
export type DaDataAPISearchPassportIssuePlaceResponseData = { suggestions: Array<DaDataPassportIssuePlace> };
