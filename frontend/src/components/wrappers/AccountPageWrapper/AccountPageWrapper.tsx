import React from "react";
import { Container } from "components/shared/Container";
import { Header } from "components/shared/Header";
import { Navbar } from "components/shared/Navbar";
import styles from "./AccountPageWrapper.module.scss";
import { AccountPageWrapperProps } from "./AccountPageWrapperProps";

function AccountPageWrapper(props: AccountPageWrapperProps) {
    return (
        <>
            <div className={styles.pageWrapper}>
                <Navbar items={props.navbarList || []} className={styles.navbar} />

                <div className={styles.content}>
                    <Header />
                    <Container className={styles.page}>{props.children}</Container>
                </div>
            </div>
        </>
    );
}

export { AccountPageWrapper };
