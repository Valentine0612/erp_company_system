import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Popup } from "./Popup";
import { Provider, useDispatch } from "react-redux";
import { makeStore } from "store";
import { PopupActionCreator } from "store/actionCreators/PopupActionCreator";
import { PopupTypeEnum } from "enums/PopupTypeEnum";

export default {
    title: "Popups/Popup",
    component: Popup,
} as ComponentMeta<typeof Popup>;

const Template: ComponentStory<typeof Popup> = () => {
    return (
        <Provider store={makeStore()}>
            <App />
        </Provider>
    );
};

export const Primary = Template.bind({});
Primary.args = {};

function App() {
    const dispatch = useDispatch();

    return (
        <>
            <Popup />
            <button onClick={() => dispatch(PopupActionCreator.openPopup(PopupTypeEnum.OTPCode))}>
                Open OTPCodePopup
            </button>
        </>
    );
}
