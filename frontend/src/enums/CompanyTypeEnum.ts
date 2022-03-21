import { DaDataCompanyTypeEnum } from "types/DaDataTypes";

export enum CompanyTypeEnum {
    IP = "SP",
    OOO = "LLC",
}

export const CompanyTypesArray = [
    { type: CompanyTypeEnum.OOO, name: "Юр. лицо", daDataType: DaDataCompanyTypeEnum.LEGAL },
    { type: CompanyTypeEnum.IP, name: "ИП", daDataType: DaDataCompanyTypeEnum.INDIVIDUAL },
];
