import { UserStateEnum } from "enums/UserStateEnum";
import { User } from "./User";

export type Task = {
    id: TaskID;
    title: TaskTitle;
    description: TaskDescription;
    price: TaskPrice;
    from_date: TaskStartDate;
    to_date: TaskExpireDate;
    is_completed: TaskIsCompleted;
    is_paid: TaskIsPaid;
    state: TaskState;
    status?: string;
    documents: Array<TaskDocument>;
    user: TaskEmployee;
};

export type TaskDocument = {
    id: number;
    title: string;
    file: string;
};

export type TaskEmployee = Omit<User, "login" | "manager" | "staff" | "verified" | "profile" | "company"> & {
    state: UserStateEnum;
    inn: string;
    about: string;
};

export type TaskID = number;
export type TaskTitle = string;
export type TaskDescription = string;
export type TaskPrice = string;
export type TaskStartDate = string;
export type TaskExpireDate = string;
export type TaskIsCompleted = boolean;
export type TaskIsPaid = boolean;
export type TaskState = TaskStateEnum;

export enum TaskStateEnum {
    ISSUED = "ISSUED",
    STARTED = "STARTED",
    FINISHED = "FINISHED",
    CHECK = "CHECK",
    CLOSED = "CLOSED",
}

export const TaskStates = {
    [TaskStateEnum.ISSUED]: "Создано",
    [TaskStateEnum.STARTED]: "В процессе",
    [TaskStateEnum.FINISHED]: "Выполнено",
    [TaskStateEnum.CHECK]: "Проверка",
    [TaskStateEnum.CLOSED]: "Завершено",
};
