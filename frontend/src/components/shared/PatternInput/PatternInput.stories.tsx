import React from "react";
import { Meta, Story } from "@storybook/react";
import { PatternInput } from ".";
import { PatternInputProps } from "./PatternInputProps";

export default {
    component: PatternInput,
    title: "Components/PatternInput",
} as Meta;

const Template: Story<PatternInputProps> = (args: PatternInputProps) => <PatternInput {...args} />;

export const PrimaryPatternInput = Template.bind({});
PrimaryPatternInput.args = { pattern: "+7 (___) ___-__-__", placeholder: "Телефон" };

export const ErrorPatternInput = Template.bind({});
ErrorPatternInput.args = { pattern: "+7 (___) ___-__-__", placeholder: "Телефон", error: true };

export const PatternInputWithDefault = Template.bind({});
PatternInputWithDefault.args = {
    pattern: "+7 (___) ___-__-__",
    placeholder: "Телефон",
    defaultValue: "9876543210",
};
