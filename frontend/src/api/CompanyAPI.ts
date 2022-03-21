import axios, { AxiosError, AxiosResponse } from "axios";
import { IncomingMessage } from "http";
import { NextApiRequest } from "next";
import { CompanyTypeEnum } from "enums/CompanyTypeEnum";
import { UserStateEnum } from "enums/UserStateEnum";
import { Company } from "types/Company";
import { Pagination, PaginationAPIFilter } from "types/Pagination";
import { User, UserCompany } from "types/User";
import { UserDocument } from "types/UserDocument";
import { NextAPIUtils } from "utils/NextAPIUtils";
import { TaskEmployee } from "types/Task";

export const CompanyAPI = {
    createCompany,
    editCompany,
    deleteCompany,
    getAllCompanies,
    getCompanyInfoByManager,
    getAllCompanyEmployees,
    getCompanyById,
    getCompanyEmployeeById,
    getCompanyEmployeeDocumentsByEmployeeId,
    previewContractWithUser,
    subscribeToCompany,
    updateAboutForCompanyUser,
};

function createCompany(data: CompanyAPICreateCompanyRequestData) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader();

    return axios
        .post(process.env.DJANGO_URL + "/main/companies/", data, { headers: defaultHeaders })
        .then((res: AxiosResponse<object>) => res)
        .catch((err: AxiosError) => err.response as AxiosResponse);
}

function getAllCompanies(
    config?: { filter?: CompanyAPIGetAllCompaniesFilter; pagination?: PaginationAPIFilter },
    req?: IncomingMessage | NextApiRequest
) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .get(process.env.DJANGO_URL + "/main/companies/", {
            headers: defaultHeaders,
            params: { ...config?.pagination, ...config?.filter },
        })
        .then((res: AxiosResponse<Pagination<Company>>) => res)
        .catch((err: AxiosError) => err.response as AxiosResponse<Pagination<Company>>);
}

function getCompanyById(id: number, req?: IncomingMessage | NextApiRequest) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .get(process.env.DJANGO_URL + `/main/companies/${id}`, { headers: defaultHeaders })
        .then((res: AxiosResponse<CompanyAPIGetCompanyByIdResult>) => res)
        .catch((err: AxiosError) => err.response as AxiosResponse<CompanyAPIGetCompanyByIdResult>);
}

function deleteCompany(id: number, req?: IncomingMessage | NextApiRequest) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .delete(process.env.DJANGO_URL + `/main/companies/${id}`, { headers: defaultHeaders })
        .then((res: AxiosResponse) => res)
        .catch((err: AxiosError) => err.response as AxiosResponse);
}

function editCompany(id: number, data: CompanyAPIEditCompanyRequestData, req?: IncomingMessage | NextApiRequest) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .patch(process.env.DJANGO_URL + `/main/companies/${id}/`, data, { headers: defaultHeaders })
        .then((res: AxiosResponse) => res)
        .catch((err: AxiosError) => err.response as AxiosResponse);
}

function getCompanyInfoByManager(req?: IncomingMessage | NextApiRequest) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .get(process.env.DJANGO_URL + "/main/company/", { headers: defaultHeaders })
        .then((res: AxiosResponse<Company>) => res)
        .catch((err: AxiosError) => err.response as AxiosResponse);
}

function getAllCompanyEmployees(
    config?: { filter?: CompanyAPIGetAllCompanyEmployeesFilter; pagination?: PaginationAPIFilter },
    req?: IncomingMessage | NextApiRequest
) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .get(process.env.DJANGO_URL + "/main/company/users/", {
            headers: defaultHeaders,
            params: { ...config?.filter, ...config?.pagination },
        })
        .then((res: AxiosResponse<CompanyAPIGetAllCompanyEmployeesData>) => res)
        .catch((err: AxiosError<CompanyAPIGetAllCompanyEmployeesData>) => err.response as AxiosResponse);
}

function getCompanyEmployeeById(id: number, req?: IncomingMessage | NextApiRequest) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .get(process.env.DJANGO_URL + "/main/company/users/" + id, { headers: defaultHeaders })
        .then((res: AxiosResponse<CompanyAPIGetCompanyEmployeeByIdData>) => res)
        .catch(
            (err: AxiosError<CompanyAPIGetCompanyEmployeeByIdData>) =>
                err.response as AxiosResponse<CompanyAPIGetCompanyEmployeeByIdData>
        );
}

function getCompanyEmployeeDocumentsByEmployeeId(id: number, req?: IncomingMessage | NextApiRequest) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .get(process.env.DJANGO_URL + `/main/company/users/${id}/documents`, { headers: defaultHeaders })
        .then((res: AxiosResponse<Array<UserDocument>>) => res)
        .catch((err: AxiosError) => err.response as AxiosResponse);
}

function previewContractWithUser(userID: number, req?: NextApiRequest | IncomingMessage) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .get(process.env.DJANGO_URL + `/main/company/users/${userID}/contract/preview/`, {
            responseType: "blob",
            headers: defaultHeaders,
        })
        .then((res: AxiosResponse<object>) => res)
        .catch((err: AxiosError) => err.response as AxiosResponse);
}

function subscribeToCompany(code: string, req?: NextApiRequest | IncomingMessage) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .post(
            process.env.DJANGO_URL + `/main/company_subscribe/`,
            {},
            {
                params: { c: code },
                headers: defaultHeaders,
            }
        )
        .then((res: AxiosResponse<object>) => res)
        .catch((err: AxiosError) => err.response as AxiosResponse);
}

function updateAboutForCompanyUser(
    userID: number,
    data: CompanyAPIUpdateAboutForCompanyUserRequestData,
    req?: IncomingMessage | NextApiRequest
) {
    const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

    return axios
        .patch(process.env.DJANGO_URL + `/main/company/users/${userID}/about/`, data, {
            headers: defaultHeaders,
        })
        .then((res: AxiosResponse<CompanyAPIUpdateAboutForCompanyUserData>) => res)
        .catch((err: AxiosError<CompanyAPIUpdateAboutForCompanyUserData>) => err.response as AxiosResponse);
}

/**
 *  CompanyAPI Filters
 */

export type CompanyAPIGetAllCompaniesFilter = { search?: string };
export type CompanyAPIGetAllCompanyEmployeesFilter = { state?: UserStateEnum; search?: string };

/**
 *  CompanyAPI Results
 */

export type CompanyAPIGetCompanyByIdResult = Company;
export type CompanyAPIGetAllCompanyEmployeesData = Pagination<TaskEmployee>;
export type CompanyAPIGetCompanyEmployeeByIdData = Omit<User, "company"> & { company: UserCompany };
export type CompanyAPIUpdateAboutForCompanyUserData = { about: string };

/**
 *  CompanyAPI Request datas
 */
export type CompanyAPIEditCompanyRequestData = {
    full_name?: string;
    short_name?: string;
    email?: string;
    address?: string;
    phone?: string;
    inn?: string;
    kpp?: string;
    ogrn?: string;
    okpo?: string;
};

export type CompanyAPICreateCompanyRequestData = {
    full_name: string;
    short_name: string;
    email: string;
    address: string;
    phone: string;
    inn: string;
    kpp?: string | null;
    ogrn: string;
    okpo: string;
    rs: string;
    ks: string;
    bik: string;
    owner: string;
    company_type: CompanyTypeEnum;

    user: Array<{
        email: string;
        name: string;
        surname: string;
        phone: string;
    }>;

    meta_data: {
        type: CompanyTypeEnum;
        dob?: string;
        pob?: string;
        registration_date?: string;
        passport?: string;
        issued?: string;
        place_of_issue?: string;
        issued_code?: string;
        residence?: string;
        ogrnip?: string;
        inn?: string;
    };
};

export type CompanyAPIUpdateAboutForCompanyUserRequestData = { about: string };
