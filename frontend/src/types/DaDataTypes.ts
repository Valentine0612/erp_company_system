export type DaDataCompany = {
    value: string;
    unrestricted_value: string;
    data: {
        kpp: string;
        capital: null;
        management?: {
            name: string;
            post: string;
            disqualified: null;
        };
        fio?: {
            gender: null;
            name: string;
            patronymic: string;
            qc: null;
            source: null;
            surname: string;
        };
        founders: null;
        managers: null;
        predecessors: null;
        successors: null;
        branch_type: string;
        branch_count: number;
        source: null;
        qc: null;
        hid: string;
        type: DaDataCompanyTypeEnum | null;
        state: {
            status: string;
            actuality_date: number;
            registration_date: number;
            liquidation_date: null;
        };
        opf: {
            type: string;
            code: string;
            full: string;
            short: string;
        };
        name: {
            full_with_opf: string;
            short_with_opf: string;
            latin: null;
            full: string;
            short: string;
        };
        inn: string;
        ogrn: string;
        okato: string;
        oktmo: string;
        okpo: string;
        okogu: string;
        okfs: string;
        okved: string;
        okveds: null;
        authorities: null;
        documents: null;
        licenses: null;
        finance: null;
        address: {
            value: string;
            unrestricted_value: string;
            // data: {};
        };
        phones: null;
        emails: null;
        ogrn_date: number;
        okved_type: string;
        employee_count: null;
    };
};

export type DaDataBank = {
    value: string;
    unrestricted_value: string;
    data: {
        opf: {
            type: string;
            full: null;
            short: null;
        };
        name: {
            payment: string;
            full: null;
            short: string;
        };
        bic: string;
        swift: string;
        inn: string;
        kpp: string;
        okpo: null;
        correspondent_account: string;
        treasury_accounts: null;
        registration_number: string;
        payment_city: string;
        state: {
            status: string;
            actuality_date: number;
            registration_date: number;
            liquidation_date: null;
        };
        rkc: null;
        cbr: null;
        address: {
            value: string;
        };
        phones: null;
    };
};

export type DaDataPassportIssuePlace = {
    value: string;
    unrestricted_value: string;
    data: {
        code: string;
        name: string;
        region: string;
        type: string;
    };
};

export enum DaDataCompanyTypeEnum {
    LEGAL = "LEGAL",
    INDIVIDUAL = "INDIVIDUAL",
}
