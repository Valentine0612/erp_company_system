import type { NextPage } from "next";
import React from "react";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { IState } from "store";
import styles from "styles/pages/ProfilePage.module.scss";
import { managersAccountNavbarList, staffAccountNavbarList, employeeAccountNavbarList } from "constants/navbarLists";
import { Card } from "components/shared/Card";
import { UserAPI } from "api/UserAPI";
import { ProfileUpdatePasswordForm } from "components/forms/ProfileUpdatePasswordForm";
import { ProfileUpdateInfoForm } from "components/forms/ProfileUpdateInfoForm";
import { useSelector } from "react-redux";
import Head from "next/head";
import { Breadcrumbs } from "components/shared/Breadcrumbs";
import { RoutesCreator } from "utils/RoutesCreator";
import { StoreWrapper } from "utils/StoreWrapper";

const ProfilePage: NextPage<undefined> = () => {
    const userState = useSelector((state: IState) => state.user.userInfo);

    async function updateAvatarAndLogin(data: { image: FileList; login: string }) {
        const result = await UserAPI.updateUserInfo({
            avatar: data.image[0] || undefined,
            login: data.login,
        });

        if (result.status === 205) return location.reload();

        console.log("updateAvatarAndLogin", result);
        return false;
    }

    async function updatePassword(data: { old_password: string; password: string; password2: string }) {
        const result = await UserAPI.updateUserPassword(data);

        if (result.status === 205) return location.reload();

        console.log("updatePassword", result);
        return false;
    }

    function getNavbarList() {
        if (userState?.staff) return staffAccountNavbarList;
        if (userState?.manager) return managersAccountNavbarList;
        return employeeAccountNavbarList;
    }

    function getBreadcrumbsList() {
        if (userState?.staff)
            return [
                { text: "Кабинет администратора", url: RoutesCreator.getStaffRoute() },
                { text: "Настройка профиля", url: RoutesCreator.getProfileRoute() },
            ];

        if (userState?.manager)
            return [
                { text: "Кабинет менеджера", url: RoutesCreator.getManagerRoute() },
                { text: "Настройка профиля", url: RoutesCreator.getProfileRoute() },
            ];

        return [
            { text: "Кабинет исполнителя", url: RoutesCreator.getProfileRoute() },
            { text: "Настройка профиля", url: RoutesCreator.getProfileRoute() },
        ];
    }

    return (
        <>
            <Head>
                <title>Настройка профиля | CyberPay</title>
            </Head>
            <AccountPageWrapper navbarList={getNavbarList()}>
                <Breadcrumbs list={getBreadcrumbsList()} />

                <Card className={styles.card}>
                    <ProfileUpdateInfoForm onSubmit={updateAvatarAndLogin} />
                </Card>

                <Card className={styles.card}>
                    <ProfileUpdatePasswordForm onSubmit={updatePassword} />
                </Card>
            </AccountPageWrapper>
        </>
    );
};

ProfilePage.getInitialProps = StoreWrapper.getInitialPageProps({ notAuthenticatedRedirect: "/" });

export default ProfilePage;
