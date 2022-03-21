import React from "react";
import { PopupWrapperProps } from "./PopupWrapperProps";
import { Popup } from "components/popups/Popup";

function PopupWrapper(props: PopupWrapperProps) {
    return (
        <>
            <Popup />
            {props.children}
        </>
    );
}

export { PopupWrapper };
