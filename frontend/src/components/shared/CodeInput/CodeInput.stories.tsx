import React from "react";
import { Meta, Story } from "@storybook/react";
import { CodeInput } from ".";
import { CodeInputProps } from "./CodeInputProps";

export default {
    component: CodeInput,
    title: "Components/CodeInput",
} as Meta;

const Template: Story<CodeInputProps> = (args: CodeInputProps) => <CodeInput {...args} />;

export const PrimaryCodeInput = Template.bind({});
PrimaryCodeInput.args = { placeholder: "Поле", length: 6 };

export const ErrorCodeInput = Template.bind({});
ErrorCodeInput.args = { placeholder: "Поле", length: 6, error: true };

export const CodeInputWithoutLabel = Template.bind({});
CodeInputWithoutLabel.args = { placeholder: "Поле", length: 6, withoutLabel: true };
