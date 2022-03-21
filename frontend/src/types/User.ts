import { OccupationTypeEnum } from "enums/OccupationTypeEnum";
import { UserStateEnum } from "enums/UserStateEnum";
import { CompanyDocument } from "./Company";
import { UserDocument } from "./UserDocument";

export type User<P = Profile> = {
    id: UserID;
    login: number;
    name: string;
    surname: string;
    patronymic?: string;
    email: string;
    phone: string;
    manager: boolean;
    staff: boolean;
    verified: boolean;
    banned: boolean;
    avatar: string;
    profile: P;
    company: Array<UserCompany>;
    type: OccupationTypeEnum;
};

export type Profile<BD = BankDetails> = {
    bankdetail: BD;
    citizenship: string;
    dob: string;
    passport: string;
    pob: string;
    residence: string;
    snils: string;
    ogrnip?: string;
    type: string;
    inn: string;
    state: UserStateEnum;
    documents: Array<UserDocument>;
};

export type BankDetails = {
    cardholder_name: string;
    bik: string;
    card: string;
    bank_account: string;
};

export type Comment = {
    id: number;
    body: string;
};

export type UserCompany = {
    about: string;
    company_id: number;
    company: string;
    state: UserStateEnum;
    comments: Array<Comment>;
    documents: Array<CompanyDocument>;
};

export type UserID = number;
