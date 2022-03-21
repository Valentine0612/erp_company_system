import React from "react";
import { Meta, Story } from "@storybook/react";
import { CompanySearchInput } from ".";

export default {
    component: CompanySearchInput,
    title: "Components/CompanySearchInput",
} as Meta;

const Template: Story = () => <CompanySearchInput />;

export const PrimaryCompanySearchInput = Template.bind({});
PrimaryCompanySearchInput.args = {};
