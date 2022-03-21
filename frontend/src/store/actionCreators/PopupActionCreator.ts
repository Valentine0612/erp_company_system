import { ChangeCompanyUserAboutPopupStateData } from "components/popups/ChangeCompanyUserAboutPopup";
import { CompanyCreatingManagerPopupData } from "components/popups/CompanyCreatingManagerPopup";
import { OTPCodePopupStateData } from "components/popups/OTPCodePopup";
import { PDFPreviewPopupStateData } from "components/popups/PDFPreviewPopup";
import { PopupTypeEnum } from "enums/PopupTypeEnum";
import { PopupActionsEnum } from "store/actions/PopupActions";

export const PopupActionCreator = {
    openPopup: openPopupActionCreate,
    closePopup: closePopupActionCreate,
    openChangeCompanyUserAboutPopup,
};

function openChangeCompanyUserAboutPopup(data: ChangeCompanyUserAboutPopupStateData) {
    return {
        type: PopupActionsEnum.OPEN_POPUP,
        payload: { name: PopupTypeEnum.ChangeCompanyUserAbout, data: data },
    };
}

function openPopupActionCreate(
    name: PopupTypeEnum,
    data?: PDFPreviewPopupStateData | OTPCodePopupStateData | CompanyCreatingManagerPopupData
) {
    return {
        type: PopupActionsEnum.OPEN_POPUP,
        payload: { name: name, data: data || null },
    };
}

function closePopupActionCreate() {
    return {
        type: PopupActionsEnum.CLOSE_POPUP,
        payload: {},
    };
}
