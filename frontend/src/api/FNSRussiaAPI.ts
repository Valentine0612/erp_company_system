import axios, { AxiosError, AxiosResponse } from "axios";
import { DEFAULT_DATE_FORMAT } from "constants/defaults";
import moment from "moment";

export class FNSRussiaAPI {
    public static checkSZStatus(data: FNSRussiaAPICheckSZStatusRequestData) {
        return axios
            .post("https://statusnpd.nalog.ru/api/v1/tracker/taxpayer_status", {
                ...data,
                requestDate: moment(new Date()).format(DEFAULT_DATE_FORMAT),
            })
            .then((res: AxiosResponse<FNSRussiaAPICheckSZStatusResponceData>) => res)
            .catch(
                (err: AxiosError<FNSRussiaAPICheckSZStatusErrorResponceData>) =>
                    err.response as AxiosResponse<FNSRussiaAPICheckSZStatusErrorResponceData>
            );
    }
}

export type FNSRussiaAPICheckSZStatusRequestData = { inn: string };

export type FNSRussiaAPICheckSZStatusResponceData = { status: boolean; message: string };
export type FNSRussiaAPICheckSZStatusErrorResponceData = { code: string; message: string } | undefined;
