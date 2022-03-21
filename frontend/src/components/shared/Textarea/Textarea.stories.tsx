import React from "react";
import { Meta, Story } from "@storybook/react";
import { Textarea } from ".";
import { TextareaProps } from "./TextareaProps";

export default {
    component: Textarea,
    title: "Components/Textarea",
} as Meta;

const Template: Story<TextareaProps> = (args: TextareaProps) => <Textarea {...args} />;

export const PrimaryTextarea = Template.bind({});
PrimaryTextarea.args = { placeholder: "Поле" };

export const ErrorTextarea = Template.bind({});
ErrorTextarea.args = { placeholder: "Поле", error: true };

export const TextareaWithoutLabel = Template.bind({});
TextareaWithoutLabel.args = { placeholder: "Поле", withoutLabel: true };
