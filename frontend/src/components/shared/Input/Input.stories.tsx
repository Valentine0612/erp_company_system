import React from "react";
import { Meta, Story } from "@storybook/react";
import { Input } from ".";
import { InputProps } from "./InputProps";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default {
    component: Input,
    title: "Components/Input",
} as Meta;

const Template: Story<InputProps> = (args: InputProps) => <Input {...args} />;

export const PrimaryInput = Template.bind({});
PrimaryInput.args = { placeholder: "Поле" };

export const ErrorInput = Template.bind({});
ErrorInput.args = { placeholder: "Поле", error: true };

export const InputWithoutLabel = Template.bind({});
InputWithoutLabel.args = { placeholder: "Поле", withoutLabel: true };

export const InputWithIcon = Template.bind({});
InputWithIcon.args = { placeholder: "Поле", icon: faSearch };
