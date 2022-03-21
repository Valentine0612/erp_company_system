import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CompanyCreatingManagerPopup } from "./CompanyCreatingManagerPopup";

export default {
    title: "Popups/CompanyCreatingManagerPopup",
    component: CompanyCreatingManagerPopup,
} as ComponentMeta<typeof CompanyCreatingManagerPopup>;

const Template: ComponentStory<typeof CompanyCreatingManagerPopup> = () => <CompanyCreatingManagerPopup />;

export const PrimaryCompanyCreatingManagerPopup = Template.bind({});
PrimaryCompanyCreatingManagerPopup.args = {};
