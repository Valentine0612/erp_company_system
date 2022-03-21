import { faAddressCard, faBuilding, faCog, faTasks, faUsers } from "@fortawesome/free-solid-svg-icons";
import { NavbarItem } from "types/NavbarItem";
import { RoutesCreator } from "utils/RoutesCreator";

export const managersAccountNavbarList: Array<NavbarItem> = [
    {
        text: "Исполнители",
        url: RoutesCreator.getManagerRoute(),
        icon: faUsers,
    },
    {
        text: "Задания",
        url: RoutesCreator.getManagerAllTasksRoute(),
        icon: faTasks,
    },
    {
        text: "Моя компания",
        url: RoutesCreator.getManagerCompanyRoute(),
        icon: faBuilding,
    },
    {
        text: "Настройка профиля",
        url: RoutesCreator.getProfileRoute(),
        icon: faCog,
    },
];

export const staffAccountNavbarList: Array<NavbarItem> = [
    {
        text: "Компании",
        url: RoutesCreator.getStaffRoute(),
        icon: faBuilding,
    },
    {
        text: "Пользователи",
        url: RoutesCreator.getStaffUsersListRoute(),
        icon: faUsers,
    },
    {
        text: "Настройка профиля",
        url: RoutesCreator.getProfileRoute(),
        icon: faCog,
    },
];

export const employeeAccountNavbarList: Array<NavbarItem> = [
    {
        text: "Мои задания",
        url: RoutesCreator.getEmployeeTasksRoute(),
        icon: faTasks,
    },
    {
        text: "Мои компании",
        url: RoutesCreator.getEmployeeCompaniesRoute(),
        icon: faBuilding,
    },
    {
        text: "Мои документы и данные",
        url: RoutesCreator.getEmployeeInfoRoute(),
        icon: faAddressCard,
    },
    {
        text: "Настройка профиля",
        url: RoutesCreator.getProfileRoute(),
        icon: faCog,
    },
];
