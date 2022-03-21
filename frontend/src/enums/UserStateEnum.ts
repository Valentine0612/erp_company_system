export enum UserStateEnum {
    READY = "READY",
    PROBLEM = "PROBLEM",
    BAN = "BAN",
    CHECK = "CHECK",
    WAITING_EMP = "WAITING_EMP",
    REFUSED = "REFUSED",
    DENIDED = "DENIDED",
}

export const UserStates = {
    [UserStateEnum.READY]: "Готов к работе",
    [UserStateEnum.PROBLEM]: "Есть проблемы",
    [UserStateEnum.BAN]: "Черный список",
    [UserStateEnum.CHECK]: "Проверка документов",
    [UserStateEnum.WAITING_EMP]: "Ожидание подписания Исполнителем",
    [UserStateEnum.REFUSED]: "Отказался",
    [UserStateEnum.DENIDED]: "Документы отклонены",
};
