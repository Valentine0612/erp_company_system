import React from "react";
import { Meta, Story } from "@storybook/react";
import { Logo } from ".";
import { LogoProps } from "./LogoProps";

export default {
    component: Logo,
    title: "Components/Logo",
} as Meta;

const Template: Story<LogoProps> = (args: LogoProps) => <Logo {...args} />;

export const PrimaryLogo = Template.bind({});
PrimaryLogo.args = {};

export const LargeLogo = Template.bind({});
PrimaryLogo.args = { size: "large" };
