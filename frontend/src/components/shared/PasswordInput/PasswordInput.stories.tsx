import React from "react";
import { Meta, Story } from "@storybook/react";
import { PasswordInput } from ".";
import { PasswordInputProps } from "./PasswordInputProps";

export default {
    component: PasswordInput,
    title: "Components/PasswordInput",
} as Meta;

const Template: Story<PasswordInputProps> = (args: PasswordInputProps) => (
    <PasswordInput {...args} />
);

export const PrimaryPasswordInput = Template.bind({});
PrimaryPasswordInput.args = {
    placeholder: "Пароль",
    defaultValue: "9876543210",
};

export const ErrorPasswordInput = Template.bind({});
ErrorPasswordInput.args = {
    placeholder: "Пароль",
    defaultValue: "9876543210",
    error: true,
};
