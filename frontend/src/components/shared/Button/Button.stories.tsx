import React from "react";
import { Meta, Story } from "@storybook/react";
import { Button } from ".";
import { ButtonProps } from "./ButtonProps";

export default {
    component: Button,
    title: "Components/Button",
} as Meta;

const Template: Story<ButtonProps> = (args: ButtonProps) => <Button {...args} />;

export const PrimaryButton = Template.bind({});
PrimaryButton.args = { children: "Кнопка" };

export const RedButton = Template.bind({});
RedButton.args = { children: "Кнопка", styleType: "red" };

export const WhiteButton = Template.bind({});
WhiteButton.args = { children: "Кнопка", styleType: "white" };
