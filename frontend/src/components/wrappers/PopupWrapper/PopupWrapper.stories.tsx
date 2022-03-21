import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PopupWrapper } from "./PopupWrapper";
import { Provider, useDispatch } from "react-redux";
import { makeStore } from "store";
import { PopupActionCreator } from "store/actionCreators/PopupActionCreator";
import { PopupTypeEnum } from "enums/PopupTypeEnum";

export default {
    title: "Wrappers/PopupWrapper",
    component: PopupWrapper,
} as ComponentMeta<typeof PopupWrapper>;

const Template: ComponentStory<typeof PopupWrapper> = (args) => (
    <Provider store={makeStore()}>
        <PopupWrapper {...args} />
    </Provider>
);

export const Primary = Template.bind({});
Primary.args = {
    children: <Child />,
};

function Child() {
    const dispatch = useDispatch();

    return (
        <>
            <button onClick={() => dispatch(PopupActionCreator.openPopup(PopupTypeEnum.OTPCode))}>
                Open OTPCodePopup
            </button>
        </>
    );
}
