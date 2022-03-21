import { ChangeCompanyUserAboutPopupStateData } from "components/popups/ChangeCompanyUserAboutPopup";
import { OTPCodePopupStateData } from "components/popups/OTPCodePopup";
import { PDFPreviewPopupStateData } from "components/popups/PDFPreviewPopup";
import { PopupTypeEnum } from "enums/PopupTypeEnum";

export type PopupState = {
    isOpen: boolean;
    name: PopupTypeEnum | null;
    data: PDFPreviewPopupStateData | OTPCodePopupStateData | ChangeCompanyUserAboutPopupStateData | null;
};

export const defaultPopupState: PopupState = {
    isOpen: false,
    name: null,
    data: null,
};
