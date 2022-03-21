import { faSearch } from "@fortawesome/free-solid-svg-icons";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import {
    CompanyAPI,
    CompanyAPIGetAllCompanyEmployeesData,
    CompanyAPIGetAllCompanyEmployeesFilter,
} from "api/CompanyAPI";
import { Input } from "components/shared/Input";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { Company } from "types/Company";
import { defaultPagination, DEFAULT_PAGINATION_LIMIT, PaginationAPIFilter } from "types/Pagination";
import styles from "styles/pages/manager/ManagerPage.module.scss";
import { managersAccountNavbarList } from "constants/navbarLists";
import { UserStateEnum, UserStates } from "enums/UserStateEnum";
import { Table } from "components/shared/Table";
import { OccupationTypes } from "enums/OccupationTypeEnum";
import { Avatar } from "components/shared/Avatar";
import { PrettyUtils } from "utils/PrettyUtils";
import { Button } from "components/shared/Button";
import base64 from "base-64";
import { useDispatch } from "react-redux";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { PaginationControl } from "components/shared/PaginationControl";
import Head from "next/head";
import { Breadcrumbs } from "components/shared/Breadcrumbs";
import { RoutesCreator } from "utils/RoutesCreator";
import { StoreWrapper } from "utils/StoreWrapper";
import { StateSwitcher } from "components/shared";

const ManagerPage: NextPage<ManagerPageProps> = (props: ManagerPageProps) => {
    const [selectedUserType, setSelectedUserType] = useState<UserStateEnum | undefined>(undefined);
    const [employeesPagination, setEmployeesPagination] = useState<CompanyAPIGetAllCompanyEmployeesData>(
        props.companyEmployeesPagination
    );
    const [searchText, setSearchText] = useState<string>("");

    const dispatch = useDispatch();

    async function getEmployeesPagination(
        pagination: PaginationAPIFilter = { limit: DEFAULT_PAGINATION_LIMIT, offset: 0 }
    ) {
        const filter: CompanyAPIGetAllCompanyEmployeesFilter = {};

        if (selectedUserType) filter.state = selectedUserType;
        if (searchText) filter.search = searchText;

        const companyEmployeesResult = await CompanyAPI.getAllCompanyEmployees({ filter, pagination });

        if (companyEmployeesResult.status === 200) return setEmployeesPagination(companyEmployeesResult.data);

        dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
        console.log(companyEmployeesResult);
    }

    function copyInviteLink() {
        navigator.clipboard.writeText(
            location.origin + `/register?u=${base64.encode(props.managersCompany.link || "")}`
        );

        dispatch(AlertionActionCreator.createAlerion("Скопировано", "success", 1000));
    }

    useEffect(() => {
        getEmployeesPagination();
    }, [selectedUserType, searchText]);

    return (
        <>
            <Head>
                <title>Исполнители | CyberPay</title>
            </Head>
            <AccountPageWrapper navbarList={managersAccountNavbarList}>
                <Breadcrumbs
                    list={[
                        { text: "Кабинет менеджера", url: RoutesCreator.getManagerRoute() },
                        { text: "Исполнители", url: RoutesCreator.getManagerRoute() },
                    ]}
                />

                <div className={styles.titleAndFindBlock}>
                    <div className={styles.leftBlock}>
                        <h2 className={styles.pageTitle}>
                            Исполнители <span>{props.companyEmployeesPagination.count}</span>
                        </h2>

                        <Button onClick={copyInviteLink} className={styles.createButton}>
                            Скопировать ссылку-приглашение
                        </Button>
                    </div>

                    <Input
                        name="search"
                        placeholder={"Поиск по ФИО, телефону, ИНН"}
                        withoutLabel
                        icon={faSearch}
                        wrapperClassName={styles.findInput}
                        onChange={(event) => setSearchText(event.target.value)}
                    />
                </div>

                <StateSwitcher
                    keyText={"EmployeeState__"}
                    list={Object.entries(UserStates).map(([state, text]) => {
                        return { state: state as UserStateEnum, text };
                    })}
                    onSelectItem={(item) => setSelectedUserType(item && item.state)}
                />

                <Table className={styles.table}>
                    <div className={styles.tableLine}>
                        <span>ФИО</span>
                        <span>Контактные данные</span>
                        <span>Форма регистрации</span>
                        <span>Статус</span>
                        <span>ИНН</span>
                    </div>

                    {(employeesPagination.results.length &&
                        employeesPagination.results.map((employee, index) => (
                            <a
                                href={RoutesCreator.getManagerEmployeeRoute(employee.id)}
                                className={styles.tableLine}
                                key={"employeesTable__item__" + index}
                            >
                                <div className={styles.avatarBlock}>
                                    <Avatar
                                        src={employee.avatar}
                                        alt={employee.email}
                                        size="small"
                                        className={styles.avatar}
                                    />
                                    <div>{PrettyUtils.getUserFullName(employee)}</div>
                                </div>

                                <div className={styles.contactsBlock}>
                                    <div>{employee.phone}</div>
                                    <div>{employee.email}</div>
                                </div>

                                <div>{OccupationTypes[employee.type]}</div>
                                <div>{UserStates[employee.state]}</div>
                                <div>{employee.inn}</div>
                            </a>
                        ))) || <div className={styles.tableLine}>Пока нет исполнителей</div>}
                </Table>

                <PaginationControl
                    itemsCount={employeesPagination.count}
                    onPageSelected={(pageNumber) =>
                        getEmployeesPagination({
                            limit: DEFAULT_PAGINATION_LIMIT,
                            offset: (pageNumber - 1) * DEFAULT_PAGINATION_LIMIT,
                        })
                    }
                />
            </AccountPageWrapper>
        </>
    );
};

ManagerPage.getInitialProps = StoreWrapper.getInitialPageProps<ManagerPageProps>(
    {
        notAuthenticatedRedirect: "/",
        storeRedirect: {
            redirect: (store) => !store.user.userInfo?.manager,
            redirectLocation: "/",
        },
    },
    () => async (context) => {
        const [managersCompanyResult, companyEmployeesResult] = await Promise.all([
            CompanyAPI.getCompanyInfoByManager(context.req),
            CompanyAPI.getAllCompanyEmployees(
                { pagination: { limit: DEFAULT_PAGINATION_LIMIT, offset: 0 } },
                context.req
            ),
        ]);

        return {
            managersCompany: managersCompanyResult.status === 200 ? managersCompanyResult.data : [],
            companyEmployeesPagination:
                companyEmployeesResult.status === 200 ? companyEmployeesResult.data : defaultPagination,
        };
    }
);

type ManagerPageProps = { managersCompany: Company; companyEmployeesPagination: CompanyAPIGetAllCompanyEmployeesData };

export default ManagerPage;
