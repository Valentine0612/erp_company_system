import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CreateCompanyManagerForm } from "./CreateCompanyManagerForm";

export default {
    title: "Forms/CreateCompanyManagerForm",
    component: CreateCompanyManagerForm,
} as ComponentMeta<typeof CreateCompanyManagerForm>;

const Template: ComponentStory<typeof CreateCompanyManagerForm> = (args) => (
    <CreateCompanyManagerForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = { onSubmit: (data) => console.log(data) };
