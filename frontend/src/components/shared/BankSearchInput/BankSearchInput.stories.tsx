import React from "react";
import { Meta, Story } from "@storybook/react";
import { BankSearchInput } from ".";

export default {
    component: BankSearchInput,
    title: "Components/BankSearchInput",
} as Meta;

const Template: Story = () => <BankSearchInput />;

export const PrimaryBankSearchInput = Template.bind({});
PrimaryBankSearchInput.args = {};
