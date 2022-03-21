import { NavbarProps } from "./NavbarProps";
import styles from "./Navbar.module.scss";
import React from "react";
import { useRouter } from "next/dist/client/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { NavbarActionCreator } from "store/actionCreators/NavbarActionCreator";
import { IState } from "store";
import { Logo } from "components/shared/Logo";
import { AuthAPI } from "api/AuthAPI";

export const Navbar = (props: NavbarProps) => {
    const isNavbarOpened = useSelector((state: IState) => state.navbar.isOpen);
    const isAuthenticated = useSelector((state: IState) => state.user.isAuthenticated);

    const router = useRouter();
    const dispatch = useDispatch();

    async function logout() {
        const result = await AuthAPI.logout();
        if (result.status === 200) return location.reload();
    }

    return (
        <div
            className={[styles.navbarWrapper, (!isNavbarOpened && styles.closed) || "", props.wrapperClassName]
                .join(" ")
                .trim()}
            onClick={(event) => event.target === event.currentTarget && dispatch(NavbarActionCreator.closeNavbar())}
        >
            <div
                className={[styles.navbar, (!isNavbarOpened && styles.closed) || "", props.className].join(" ").trim()}
            >
                <Logo type="white" className={styles.logo} />

                <nav>
                    <ul>
                        {props.items.map((item, index) => (
                            <li
                                key={"navbar__item__" + index}
                                className={[styles.navbarItem, (router.pathname === item.url && styles.selected) || ""]
                                    .join(" ")
                                    .trim()}
                            >
                                <a href={item.url} className={styles.navbarItemLink}>
                                    <div className={styles.navbarItemIconWrapper}>
                                        <FontAwesomeIcon icon={item.icon} className={styles.navbarItemIcon} />
                                    </div>
                                    <span className={styles.navbarItemText}>{item.text}</span>
                                </a>
                            </li>
                        ))}

                        {isAuthenticated && (
                            <li className={styles.navbarItem} onClick={logout}>
                                <div className={styles.navbarItemLink}>
                                    <div className={styles.navbarItemIconWrapper}>
                                        <FontAwesomeIcon icon={faSignOutAlt} className={styles.navbarItemIcon} />
                                    </div>
                                    <span className={styles.navbarItemText}>Выйти</span>
                                </div>
                            </li>
                        )}
                    </ul>
                </nav>

                <div
                    className={[styles.navbarItem, styles.closeButton].join(" ")}
                    onClick={() => dispatch(NavbarActionCreator.closeNavbar())}
                >
                    <div className={styles.navbarItemLink}>
                        <div className={styles.navbarItemIconWrapper}>
                            <FontAwesomeIcon icon={faTimes} className={styles.navbarItemIcon} />
                        </div>
                        <span className={styles.navbarItemText}>Закрыть</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
