import { SubscibeToCompanyStatusEnum } from "enums/SubscibeToCompanyStatusEnum";
import { TaskID } from "types/Task";

export class RoutesCreator {
    public static getManagerRoute = () => `/manager`;
    public static getManagerAllTasksRoute = () => `/manager/tasks`;
    public static getManagerNewTaskRoute = (params?: { edit: boolean; taskId: TaskID }) => {
        if (params)
            return `/manager/task-editor?${Object.entries(params)
                .map(([key, value]) => `${key}=${value}`)
                .join("&")}`;
        return `/manager/task-editor`;
    };
    public static getManagerTaskRoute = (id: TaskID) => `/manager/tasks/${id}`;
    public static getManagerEmployeeRoute = (id: number) => `/manager/employee/${id}`;
    public static getManagerEmployeeTasksRoute = (id: number) => `/manager/employee/${id}/tasks`;
    public static getManagerEmployeeDocumentsRoute = (id: number) => `/manager/employee/${id}/documents`;
    public static getManagerCompanyRoute = () => `/manager/company`;

    public static getStaffRoute = () => `/staff`;
    public static getStaffCreateCompanyRoute = () => `/staff/create-company`;
    public static getStaffUsersListRoute = () => `/staff/users`;
    public static getStaffUserDetailsRoute = (id: number) => `/staff/users/${id}`;
    public static getStaffCompanyPageRoute = (id: number) => `/staff/company/${id}`;
    public static getStaffEditCompanyPageRoute = (id: number) => `/staff/company/${id}/edit`;

    public static getEmployeeInfoRoute = () => `/employee/info`;
    public static getEmployeeCompaniesRoute = (successSubscribe?: SubscibeToCompanyStatusEnum) =>
        `/employee/companies` + (successSubscribe ? `?success_subscribe=${successSubscribe}` : "");
    public static getEmployeeCompanyRoute = (companyID: number) => `/employee/companies/${companyID}`;
    public static getEmployeeTasksRoute = () => `/employee/tasks`;
    public static getEmployeeTaskRoute = (taskId: TaskID, companyId: number) =>
        `/employee/tasks/${taskId}?company_id=${companyId}`;

    public static getProfileRoute = () => `/profile`;
}
