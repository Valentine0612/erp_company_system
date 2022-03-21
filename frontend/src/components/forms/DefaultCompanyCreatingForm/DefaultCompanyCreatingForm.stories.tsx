import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { DefaultCompanyCreatingForm } from "./DefaultCompanyCreatingForm";

export default {
    title: "Forms/DefaultCompanyCreatingForm",
    component: DefaultCompanyCreatingForm,
} as ComponentMeta<typeof DefaultCompanyCreatingForm>;

const Template: ComponentStory<typeof DefaultCompanyCreatingForm> = (args) => <DefaultCompanyCreatingForm {...args} />;

export const Primary = Template.bind({});
Primary.args = { onSubmit: (data) => console.log(data) };
