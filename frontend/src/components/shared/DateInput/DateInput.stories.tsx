import React from "react";
import { Meta, Story } from "@storybook/react";
import { DateInput } from ".";
import { DateInputProps } from "./DateInput.props";

export default {
    component: DateInput,
    title: "Components/DateInput",
} as Meta;

const Template: Story<DateInputProps> = (args: DateInputProps) => <DateInput {...args} />;

export const PrimaryDateInput = Template.bind({});
PrimaryDateInput.args = { placeholder: "Поле" };

export const ErrorDateInput = Template.bind({});
ErrorDateInput.args = { placeholder: "Поле", error: true };

export const DateInputWithoutLabel = Template.bind({});
DateInputWithoutLabel.args = { placeholder: "Поле", withoutLabel: true };

export const DateInputWithIcon = Template.bind({});
DateInputWithIcon.args = { placeholder: "Поле", icon: "" };
