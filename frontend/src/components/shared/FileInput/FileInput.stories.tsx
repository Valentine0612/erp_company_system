import React from "react";
import { Meta, Story } from "@storybook/react";
import { FileInput } from ".";
import { FileInputProps } from "./FileInputProps";

export default {
    component: FileInput,
    title: "Components/FileInput",
} as Meta;

const Template: Story<FileInputProps> = (args: FileInputProps) => <FileInput {...args} />;

export const PrimaryFileInput = Template.bind({});
PrimaryFileInput.args = { placeholder: "Поле" };

export const ErrorFileInput = Template.bind({});
ErrorFileInput.args = { placeholder: "Поле", error: true };
