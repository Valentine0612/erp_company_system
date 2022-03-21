export enum BankDetailsTypeEnum {
    card = "CARD",
    bankAccount = "BANK_ACCOUNT",
}

export const BankDetailsTypesArray = [
    { type: BankDetailsTypeEnum.card, name: "Номер карты" },
    { type: BankDetailsTypeEnum.bankAccount, name: "Банковский счет" },
];
