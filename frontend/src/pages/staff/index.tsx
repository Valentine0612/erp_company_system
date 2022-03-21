import type { NextPage } from "next";
import React, { useState } from "react";
import { CompanyAPI, CompanyAPIGetAllCompaniesFilter } from "api/CompanyAPI";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { staffAccountNavbarList } from "constants/navbarLists";
import { Company } from "types/Company";
import { defaultPagination, DEFAULT_PAGINATION_LIMIT, Pagination, PaginationAPIFilter } from "types/Pagination";
import styles from "styles/pages/staff/StaffPage.module.scss";
import { Table } from "components/shared/Table";
import Head from "next/head";
import { Breadcrumbs } from "components/shared/Breadcrumbs";
import { RoutesCreator } from "utils/RoutesCreator";
import { Input, PaginationControl } from "components/shared";
import { useDispatch } from "react-redux";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { StoreWrapper } from "utils/StoreWrapper";

const StaffPage: NextPage<StaffPageProps> = (props: StaffPageProps) => {
    const [companiesPagination, setCompaniesPagination] = useState<Pagination<Company>>(props.companiesPagination);
    const [searchText, setSearchText] = useState<string>("");

    const dispatch = useDispatch();

    async function getCompaniesPagination(
        filter: CompanyAPIGetAllCompaniesFilter,
        pagination: PaginationAPIFilter = { limit: DEFAULT_PAGINATION_LIMIT, offset: 0 }
    ) {
        const companiesResult = await CompanyAPI.getAllCompanies({ filter, pagination });

        if (companiesResult.status === 200) return setCompaniesPagination(companiesResult.data);

        dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
        console.log(companiesResult);
    }

    return (
        <>
            <Head>
                <title>Компании | CyberPay</title>
            </Head>

            <AccountPageWrapper navbarList={staffAccountNavbarList}>
                <Breadcrumbs
                    list={[
                        { text: "Кабинет администратора", url: RoutesCreator.getStaffRoute() },
                        { text: "Компании", url: RoutesCreator.getStaffRoute() },
                    ]}
                />

                <div className={styles.titleAndFindBlock}>
                    <div className={styles.leftBlock}>
                        <h2 className={styles.pageTitle}>
                            Компании <span>{props.companiesPagination.count}</span>
                        </h2>

                        <a href="/staff/create-company" className={styles.createButton}>
                            Создать компанию
                        </a>
                    </div>

                    <Input
                        placeholder={"Поиск компании по названию"}
                        withoutLabel
                        icon={faSearch}
                        wrapperClassName={styles.findInput}
                        value={searchText}
                        onChange={(event) => {
                            setSearchText(event.target.value);
                            getCompaniesPagination({ search: event.target.value });
                        }}
                    />
                </div>

                <Table className={styles.table}>
                    <div className={styles.tableLine}>
                        <span>Название</span>
                        <span>Контактные данные</span>
                    </div>

                    {(companiesPagination.results.length &&
                        companiesPagination.results.map((company, index) => (
                            <a
                                href={RoutesCreator.getStaffCompanyPageRoute(company.id || 0)}
                                className={styles.tableLine}
                                key={"employeesTable__item__" + index}
                            >
                                <div className={styles.nameBlock}>{company.full_name}</div>
                                <div className={styles.contactsBlock}>
                                    <div>{company.phone}</div>
                                    <div>{company.email}</div>
                                </div>
                            </a>
                        ))) || <div className={styles.tableLine}>Пока нет компаний</div>}
                </Table>

                <PaginationControl
                    itemsCount={companiesPagination.count}
                    onPageSelected={(pageNumber) =>
                        getCompaniesPagination(
                            { search: searchText },
                            { limit: DEFAULT_PAGINATION_LIMIT, offset: (pageNumber - 1) * DEFAULT_PAGINATION_LIMIT }
                        )
                    }
                />
            </AccountPageWrapper>
        </>
    );
};

StaffPage.getInitialProps = StoreWrapper.getInitialPageProps<StaffPageProps>(
    {
        notAuthenticatedRedirect: "/",
        storeRedirect: {
            redirect: (store) => !store.user.userInfo?.staff,
            redirectLocation: "/",
        },
    },
    () => async (context) => {
        const companiesListResult = await CompanyAPI.getAllCompanies(
            { pagination: { limit: DEFAULT_PAGINATION_LIMIT, offset: 0 } },
            context.req
        );

        return {
            companiesPagination: companiesListResult.status === 200 ? companiesListResult.data : defaultPagination,
        };
    }
);

type StaffPageProps = { companiesPagination: Pagination<Company> };

export default StaffPage;
