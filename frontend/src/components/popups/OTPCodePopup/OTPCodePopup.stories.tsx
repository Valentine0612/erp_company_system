import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { OTPCodePopup } from "./OTPCodePopup";

export default {
    title: "Popups/OTPCodePopup",
    component: OTPCodePopup,
} as ComponentMeta<typeof OTPCodePopup>;

const Template: ComponentStory<typeof OTPCodePopup> = () => <OTPCodePopup />;

export const PrimaryOTPCodePopup = Template.bind({});
PrimaryOTPCodePopup.args = {};
