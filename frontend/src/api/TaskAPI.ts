import axios, { AxiosError, AxiosResponse } from "axios";
import { IncomingMessage } from "http";
import { NextApiRequest } from "next";
import { Pagination, PaginationAPIFilter } from "types/Pagination";
import {
    Task,
    TaskDescription,
    TaskExpireDate,
    TaskID,
    TaskPrice,
    TaskStartDate,
    TaskState,
    TaskTitle,
} from "types/Task";
import { UserID } from "types/User";
import { NextAPIUtils } from "utils/NextAPIUtils";

export class TaskAPI {
    public static createTask(data: TaskAPICreateTaskRequestData) {
        const defaultHeaders = NextAPIUtils.getDefaultHeader();
        const formData = NextAPIUtils.createFormData(data);

        return axios
            .post(process.env.DJANGO_URL + `/tasks/`, formData, {
                headers: defaultHeaders,
            })
            .then((res: AxiosResponse<TaskAPICreateTaskResponseData>) => res)
            .catch(
                (err: AxiosError<TaskAPICreateTaskResponseData>) =>
                    err.response as AxiosResponse<TaskAPICreateTaskResponseData>
            );
    }

    public static getTask(id: TaskID, req?: IncomingMessage | NextApiRequest) {
        const defaultHeaders = NextAPIUtils.getDefaultHeader(req);

        return axios
            .get(process.env.DJANGO_URL + `/tasks/${id}/`, {
                headers: defaultHeaders,
            })
            .then((res: AxiosResponse<TaskAPIGetTaskResponseData>) => res)
            .catch((err: AxiosError<TaskAPIGetTaskResponseData>) => err.response as AxiosResponse);
    }

    public static getAllTasks(
        params?: { user?: UserID; state?: TaskState } & PaginationAPIFilter,
        req?: IncomingMessage | NextApiRequest
    ) {
        const headers = NextAPIUtils.getDefaultHeader(req);

        return axios
            .get(process.env.DJANGO_URL + `/tasks/`, { headers, params })
            .then((res: AxiosResponse<TaskAPIGetAllTasksResponseData>) => res)
            .catch(
                (err: AxiosError<TaskAPIGetAllTasksResponseData>) =>
                    err.response as AxiosResponse<TaskAPIGetAllTasksResponseData>
            );
    }

    public static getCompanyTasksByEmployee(
        params?: { company_id?: number } & PaginationAPIFilter,
        req?: IncomingMessage | NextApiRequest
    ) {
        const headers = NextAPIUtils.getDefaultHeader(req);

        return axios
            .get(process.env.DJANGO_URL + `/tasks/user/`, { headers, params })
            .then((res: AxiosResponse<TaskAPIGetCompanyTasksByEmployeeResponseData>) => res)
            .catch(
                (err: AxiosError<TaskAPIGetCompanyTasksByEmployeeResponseData>) =>
                    err.response as AxiosResponse<TaskAPIGetCompanyTasksByEmployeeResponseData>
            );
    }

    public static getTaskByEmployee(
        id: TaskID,
        params: { company_id: number },
        req?: IncomingMessage | NextApiRequest
    ) {
        const headers = NextAPIUtils.getDefaultHeader(req);

        return axios
            .get(process.env.DJANGO_URL + `/tasks/user/${id}/`, { headers, params })
            .then((res: AxiosResponse<TaskAPIGetTaskByEmployeeResponseData>) => res)
            .catch(
                (err: AxiosError<TaskAPIGetTaskByEmployeeResponseData>) =>
                    err.response as AxiosResponse<TaskAPIGetTaskByEmployeeResponseData>
            );
    }

    public static changeTaskStateByEmployee(
        data: TaskAPIChangeTaskStateByEmployeeRequestData,
        req?: IncomingMessage | NextApiRequest
    ) {
        const headers = NextAPIUtils.getDefaultHeader(req);

        return axios
            .post(process.env.DJANGO_URL + `/tasks/state/`, data, { headers })
            .then((res: AxiosResponse<TaskAPIGetTaskByEmployeeResponseData>) => res)
            .catch(
                (err: AxiosError<TaskAPIGetTaskByEmployeeResponseData>) =>
                    err.response as AxiosResponse<TaskAPIGetTaskByEmployeeResponseData>
            );
    }

    public static changeTaskStateByManager(
        data: TaskAPIChangeTaskStateByManagerRequestData,
        req?: IncomingMessage | NextApiRequest
    ) {
        const headers = NextAPIUtils.getDefaultHeader(req);

        return axios
            .post(process.env.DJANGO_URL + `/tasks/state_manager/`, data, { headers })
            .then((res: AxiosResponse<TaskAPIChangeTaskStateByManagerResponseData>) => res)
            .catch(
                (err: AxiosError<TaskAPIChangeTaskStateByManagerResponseData>) =>
                    err.response as AxiosResponse<TaskAPIChangeTaskStateByManagerResponseData>
            );
    }

    public static createCloseDocumentByManager(
        data: TaskAPICreateCloseDocumentByManagerRequestData,
        req?: IncomingMessage | NextApiRequest
    ) {
        const headers = NextAPIUtils.getDefaultHeader(req);

        return axios
            .post(process.env.DJANGO_URL + `/tasks/close/`, data, { headers })
            .then((res: AxiosResponse<TaskAPICreateCloseDocumentByManagerResponseData>) => res)
            .catch(
                (err: AxiosError<TaskAPICreateCloseDocumentByManagerResponseData>) =>
                    err.response as AxiosResponse<TaskAPICreateCloseDocumentByManagerResponseData>
            );
    }

    public static confirmCloseDocumentByEmployee(
        taskId: TaskID,
        data: TaskAPIConfirmCloseDocumentByEmployeeRequestData,
        req?: IncomingMessage | NextApiRequest
    ) {
        const headers = NextAPIUtils.getDefaultHeader(req);

        return axios
            .post(process.env.DJANGO_URL + `/tasks/user/${taskId}/`, data, { headers })
            .then((res: AxiosResponse<TaskAPIConfirmCloseDocumentByEmployeeResponseData>) => res)
            .catch(
                (err: AxiosError<TaskAPIConfirmCloseDocumentByEmployeeResponseData>) =>
                    err.response as AxiosResponse<TaskAPIConfirmCloseDocumentByEmployeeResponseData>
            );
    }

    public static getAllTasksByEmployee(
        params?: { state?: TaskState } & PaginationAPIFilter,
        req?: IncomingMessage | NextApiRequest
    ) {
        const headers = NextAPIUtils.getDefaultHeader(req);

        return axios
            .get(process.env.DJANGO_URL + `/tasks/user_all/`, { headers, params })
            .then((res: AxiosResponse<TaskAPIGetAllTasksByEmployeeResponseData>) => res)
            .catch(
                (err: AxiosError<TaskAPIGetAllTasksByEmployeeResponseData>) =>
                    err.response as AxiosResponse<TaskAPIGetAllTasksByEmployeeResponseData>
            );
    }

    public static deleteTasksByManager(id: TaskID, req?: IncomingMessage | NextApiRequest) {
        const headers = NextAPIUtils.getDefaultHeader(req);

        return axios
            .delete(process.env.DJANGO_URL + `/tasks/${id}/`, { headers })
            .then((res: AxiosResponse<null>) => res)
            .catch((err: AxiosError<null>) => err.response as AxiosResponse<null>);
    }

    public static updateTaskByManager(
        id: TaskID,
        data: TaskAPIUpdateTaskByManagerRequestData,
        req?: IncomingMessage | NextApiRequest
    ) {
        const headers = NextAPIUtils.getDefaultHeader(req);

        return axios
            .patch(process.env.DJANGO_URL + `/tasks/${id}/`, data, { headers })
            .then((res: AxiosResponse<TaskAPIGUpdateTaskByManagerResponseData>) => res)
            .catch(
                (err: AxiosError<TaskAPIGUpdateTaskByManagerResponseData>) =>
                    err.response as AxiosResponse<TaskAPIGUpdateTaskByManagerResponseData>
            );
    }

    public static deleteTaskFilesByManager(
        id: TaskID,
        data: TaskAPIDeleteTaskFilesByManagerRequestData,
        req?: IncomingMessage | NextApiRequest
    ) {
        const headers = NextAPIUtils.getDefaultHeader(req);

        return axios
            .delete(process.env.DJANGO_URL + `/tasks/${id}/documents/`, { headers, data })
            .then((res: AxiosResponse<TaskAPIGUpdateTaskByManagerResponseData>) => res)
            .catch(
                (err: AxiosError<TaskAPIGUpdateTaskByManagerResponseData>) =>
                    err.response as AxiosResponse<TaskAPIGUpdateTaskByManagerResponseData>
            );
    }

    public static addTaskFileByManager(
        id: TaskID,
        data: TaskAPIAddTaskFileByManagerRequestData,
        req?: IncomingMessage | NextApiRequest
    ) {
        const headers = NextAPIUtils.getDefaultHeader(req);
        const formData = NextAPIUtils.createFormData(data);

        return axios
            .post(process.env.DJANGO_URL + `/tasks/${id}/documents/`, formData, { headers })
            .then((res: AxiosResponse<TaskAPIGUpdateTaskByManagerResponseData>) => res)
            .catch(
                (err: AxiosError<TaskAPIGUpdateTaskByManagerResponseData>) =>
                    err.response as AxiosResponse<TaskAPIGUpdateTaskByManagerResponseData>
            );
    }
}

export type TaskAPICreateTaskRequestData = {
    user: UserID;
    title: TaskTitle;
    description: TaskDescription;
    price: TaskPrice;
    from_date?: TaskStartDate;
    to_date: TaskExpireDate;
    files: Array<File>;
    titles: Array<string>;
};

export type TaskAPIUpdateTaskByManagerRequestData = Omit<TaskAPICreateTaskRequestData, "files" | "titles">;
export type TaskAPIDeleteTaskFilesByManagerRequestData = { documents: Array<number> };
export type TaskAPIAddTaskFileByManagerRequestData = { file: File; title: string };

export type TaskAPIChangeTaskStateByEmployeeRequestData = {
    company_id: number;
    task_id: TaskID;
};

export type TaskAPIChangeTaskStateByManagerRequestData = {
    task_id: TaskID;
};

export type TaskAPICreateCloseDocumentByManagerRequestData = {
    tasks: Array<TaskID>;
    code: string;
};

export type TaskAPIConfirmCloseDocumentByEmployeeRequestData = {
    company_id: number;
    code: string;
};

export type TaskAPICreateTaskResponseData = Task;
export type TaskAPIGetTaskResponseData = Task;
export type TaskAPIGetAllTasksResponseData = Pagination<Task>;
export type TaskAPIGetCompanyTasksByEmployeeResponseData = Pagination<Omit<Task, "user">>;
export type TaskAPIGetTaskByEmployeeResponseData = Omit<Task, "user">;
export type TaskAPIChangeTaskStateByEmployeeResponseData = Omit<Task, "user">;
export type TaskAPIChangeTaskStateByManagerResponseData = Omit<Task, "user">;
export type TaskAPICreateCloseDocumentByManagerResponseData = null;
export type TaskAPIConfirmCloseDocumentByEmployeeResponseData = null;
export type TaskAPIGetAllTasksByEmployeeResponseData = Pagination<
    Omit<Task, "user"> & { company_id: number; company: string }
>;
export type TaskAPIGUpdateTaskByManagerResponseData = Task;
