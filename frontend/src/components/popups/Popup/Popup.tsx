import styles from "./Popup.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { PopupTypeEnum } from "enums/PopupTypeEnum";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { IState } from "store";
import { PopupActionCreator } from "store/actionCreators/PopupActionCreator";
// import PDFPreviewPopup from "components/popups/PDFPreviewPopup";
import CompanyCreatingManagerPopup from "components/popups/CompanyCreatingManagerPopup";
import ChangeCompanyUserAboutPopup from "../ChangeCompanyUserAboutPopup";

const OTPCodePopup = dynamic(() => import("components/popups/OTPCodePopup"));

const popupsList: Array<{ type: PopupTypeEnum; component: ReactNode | (() => ReactNode) }> = [
    { type: PopupTypeEnum.OTPCode, component: <OTPCodePopup /> },
    // { type: PopupTypeEnum.PDFPreview, component: <PDFPreviewPopup /> },
    { type: PopupTypeEnum.CompanyCreatingManagerPopup, component: <CompanyCreatingManagerPopup /> },
    { type: PopupTypeEnum.ChangeCompanyUserAbout, component: <ChangeCompanyUserAboutPopup /> },
];

export function Popup() {
    const [lastPopupType, setLastPopupType] = useState<PopupTypeEnum>();
    const popupState = useSelector((state: IState) => state.popup);

    const dispatch = useDispatch();

    const closePopupOnClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        if (event.currentTarget === event.target) {
            dispatch(PopupActionCreator.closePopup());
        }
    };

    useEffect(() => {
        if (popupState.name) setLastPopupType(popupState.name);
    }, [popupState.name]);

    return (
        <div
            className={[styles.popupWrapper, popupState.isOpen ? undefined : styles.popupWrapper__closed]
                .join(" ")
                .trim()}
            onClick={closePopupOnClick}
        >
            <div className={styles.wrapperInner} onClick={closePopupOnClick}>
                <div className={styles.popup}>
                    <div className={styles.closeButton} onClick={() => dispatch(PopupActionCreator.closePopup())}>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>

                    <div className={styles.popupView}>
                        {(() => {
                            const currentPopup = popupsList.find((popup) => popup.type === lastPopupType);

                            return currentPopup?.component;
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}
