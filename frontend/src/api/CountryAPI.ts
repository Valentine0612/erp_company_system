import axios, { AxiosError, AxiosResponse } from "axios";
import { IncomingMessage } from "http";
import { NextApiRequest } from "next";
import { NextAPIUtils } from "utils/NextAPIUtils";

export const CountryAPI = {
    getAllCountries,
};

function getAllCountries(req?: NextApiRequest | IncomingMessage) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .get(process.env.DJANGO_URL + "/main/countries/", { headers: defaultHeaders })
        .then((res: AxiosResponse<CountryAPIGetAllCountriesData>) => res)
        .catch(
            (err: AxiosError<CountryAPIGetAllCountriesData>) =>
                err.response as AxiosResponse<CountryAPIGetAllCountriesData>
        );
}

export type CountryAPIGetAllCountriesData = Array<{ name: string }>;
