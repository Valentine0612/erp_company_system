import { CompanyTypeEnum } from "enums/CompanyTypeEnum";

export type Company = {
    id: number;
    full_name: string;
    short_name: string;
    email: string;
    address: string;
    phone: string;

    company_type: CompanyTypeEnum;

    inn?: string;
    kpp?: string;
    ogrn?: string;
    okpo?: string;
    rs?: string;
    ks?: string;
    bik?: string;
    bank_info?: string;
    link?: string;

    amount: number;
    amount_on_hold: number;

    receipts: CompanyReceipts;
};

export type CompanyDocument = {
    title: string;
    document: string;
};

export type CompanyReceipts = {
    active_workers: number;
    from_period: string;
    to_period: string;
    total: number;
};
