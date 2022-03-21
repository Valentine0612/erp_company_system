import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ChangeCompanyUserAboutPopup } from "./ChangeCompanyUserAboutPopup";

export default {
    title: "Popups/ChangeCompanyUserAboutPopup",
    component: ChangeCompanyUserAboutPopup,
} as ComponentMeta<typeof ChangeCompanyUserAboutPopup>;

const Template: ComponentStory<typeof ChangeCompanyUserAboutPopup> = () => <ChangeCompanyUserAboutPopup />;

export const PrimaryChangeCompanyUserAboutPopup = Template.bind({});
PrimaryChangeCompanyUserAboutPopup.args = {};
