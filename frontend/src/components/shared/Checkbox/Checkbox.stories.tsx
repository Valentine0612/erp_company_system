import React from "react";
import { Meta, Story } from "@storybook/react";
import { Checkbox } from ".";
import { CheckboxProps } from "./CheckboxProps";

export default {
    component: Checkbox,
    title: "Components/Checkbox",
} as Meta;

const Template: Story<CheckboxProps> = (args: CheckboxProps) => <Checkbox {...args} />;

export const PrimaryCheckbox = Template.bind({});
PrimaryCheckbox.args = {
    id: "checkbox",
    label: "Checkbox",
};
