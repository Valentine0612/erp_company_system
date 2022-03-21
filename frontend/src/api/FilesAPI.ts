import axios, { AxiosError, AxiosResponse } from "axios";
import { NextAPIUtils } from "utils/NextAPIUtils";

export class FilesAPI {
    public static getFile(fileURL: string) {
        const headers = NextAPIUtils.getDefaultHeader();

        return axios
            .get(fileURL, { responseType: "blob", headers })
            .then((res: AxiosResponse<object>) => res)
            .catch((err: AxiosError<object>) => err.response as AxiosResponse);
    }
}
