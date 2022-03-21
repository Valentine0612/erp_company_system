import React from "react";
import { Meta, Story } from "@storybook/react";
import { FormErrorsBlock } from ".";
import { FormErrorsBlockProps } from "./FormErrorsBlockProps";

export default {
    component: FormErrorsBlock,
    title: "Components/FormErrorsBlock",
} as Meta;

const Template: Story<FormErrorsBlockProps> = (args: FormErrorsBlockProps) => (
    <FormErrorsBlock {...args} />
);

export const PrimaryFormErrorsBlock = Template.bind({});
PrimaryFormErrorsBlock.args = {
    errors: {
        error_1: { message: "Error_1 information" },
        error_2: { message: "Error_2 information" },
        error_3: { message: "Error_3 information" },
    },
};
