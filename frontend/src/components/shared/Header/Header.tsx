import { HeaderProps } from "./HeaderProps";
import styles from "./Header.module.scss";
import { Container } from "components/shared/Container";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { NavbarActionCreator } from "store/actionCreators/NavbarActionCreator";

export const Header = (props: HeaderProps) => {
    const dispatch = useDispatch();

    return (
        <header className={[styles.header, props.className].join(" ").trim()}>
            <Container className={styles.container}>
                <div className={styles.menu} onClick={() => dispatch(NavbarActionCreator.openNavbar())}>
                    <FontAwesomeIcon icon={faBars} />
                    <span>Меню</span>
                </div>
            </Container>
        </header>
    );
};
