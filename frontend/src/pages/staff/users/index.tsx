import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { defaultPagination, DEFAULT_PAGINATION_LIMIT, PaginationAPIFilter } from "types/Pagination";
import styles from "styles/pages/staff/users/StaffUsersListPage.module.scss";
import { staffAccountNavbarList } from "constants/navbarLists";
import { Table } from "components/shared/Table";
import { Avatar } from "components/shared/Avatar";
import { PrettyUtils } from "utils/PrettyUtils";
import { UserAPI, UserAPIGetUsersByStaffData } from "api/UserAPI";
import Head from "next/head";
import { Breadcrumbs } from "components/shared/Breadcrumbs";
import { RoutesCreator } from "utils/RoutesCreator";
import { PaginationControl, StateSwitcher } from "components/shared";
import { useDispatch } from "react-redux";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { StoreWrapper } from "utils/StoreWrapper";

const StaffUsersListPage: NextPage<StaffUsersListPageProps> = (props: StaffUsersListPageProps) => {
    const [usersPagination, setUsersPagination] = useState<UserAPIGetUsersByStaffData>(props.users);
    const [isVerifiedUsersSelected, setIsVerifiedUsersSelected] = useState<boolean | undefined>(undefined);
    const [paginationPage, setPaginationPage] = useState<number>(1);

    const dispatch = useDispatch();

    useEffect(() => {
        getUsersPagination({
            is_verified: isVerifiedUsersSelected,
            pagination: {
                limit: DEFAULT_PAGINATION_LIMIT,
                offset: (paginationPage - 1) * DEFAULT_PAGINATION_LIMIT,
            },
        });
    }, [paginationPage, isVerifiedUsersSelected]);

    async function getUsersPagination(config: { is_verified?: boolean; pagination?: PaginationAPIFilter }) {
        const usersResult = await UserAPI.getUsersByStaff({
            ...config,
            pagination: config.pagination || { limit: DEFAULT_PAGINATION_LIMIT, offset: 0 },
        });

        if (usersResult.status === 200) return setUsersPagination(usersResult.data);

        dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
        console.log(usersResult);
    }

    return (
        <>
            <Head>
                <title>Пользователи | CyberPay</title>
            </Head>

            <AccountPageWrapper navbarList={staffAccountNavbarList}>
                <Breadcrumbs
                    list={[
                        { text: "Кабинет администратора", url: RoutesCreator.getStaffRoute() },
                        { text: "Пользователи", url: RoutesCreator.getStaffUsersListRoute() },
                    ]}
                />

                <h2 className={styles.pageTitle}>
                    Пользователи <span>{usersPagination.count}</span>
                </h2>

                <StateSwitcher
                    keyText={"IsUserVerifiedState__"}
                    list={[
                        { state: true, text: "Проверенные" },
                        { state: false, text: "Непроверенные" },
                    ]}
                    onSelectItem={(item) => setIsVerifiedUsersSelected(item && item.state)}
                />

                <Table className={styles.table}>
                    <div className={styles.tableLine}>
                        <span>ФИО</span>
                        <span>Контактные данные</span>
                    </div>

                    {(usersPagination.results.length &&
                        usersPagination.results.map((user, index) => (
                            <a
                                href={RoutesCreator.getStaffUserDetailsRoute(user.id)}
                                className={styles.tableLine}
                                key={"employeesTable__item__" + index}
                            >
                                <div className={styles.avatarBlock}>
                                    <Avatar src={user.avatar} alt={user.email} size="small" className={styles.avatar} />
                                    <div>{PrettyUtils.getUserFullName(user)}</div>
                                </div>

                                <div className={styles.contactsBlock}>
                                    <div>{user.phone}</div>
                                    <div>{user.email}</div>
                                </div>
                            </a>
                        ))) || <div className={styles.tableLine}>Пока нет пользователей</div>}
                </Table>

                <PaginationControl
                    itemsCount={usersPagination.count}
                    onPageSelected={(pageNumber) => setPaginationPage(pageNumber)}
                />
            </AccountPageWrapper>
        </>
    );
};

StaffUsersListPage.getInitialProps = StoreWrapper.getInitialPageProps<StaffUsersListPageProps>(
    {
        notAuthenticatedRedirect: "/",
        storeRedirect: { redirect: (state) => !state.user.userInfo?.staff, redirectLocation: "/" },
    },
    () => async (context) => {
        const usersPaginationResult = await UserAPI.getUsersByStaff(
            { pagination: { limit: DEFAULT_PAGINATION_LIMIT, offset: 0 } },
            context.req
        );

        return { users: usersPaginationResult.status === 200 ? usersPaginationResult.data : defaultPagination };
    }
);

type StaffUsersListPageProps = { users: UserAPIGetUsersByStaffData };

export default StaffUsersListPage;
