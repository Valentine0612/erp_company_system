import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SPCompanyCreatingForm } from "./SPCompanyCreatingForm";

export default {
    title: "Forms/SPCompanyCreatingForm",
    component: SPCompanyCreatingForm,
} as ComponentMeta<typeof SPCompanyCreatingForm>;

const Template: ComponentStory<typeof SPCompanyCreatingForm> = (args) => <SPCompanyCreatingForm {...args} />;

export const Primary = Template.bind({});
Primary.args = { onSubmit: (data) => console.log(data) };
