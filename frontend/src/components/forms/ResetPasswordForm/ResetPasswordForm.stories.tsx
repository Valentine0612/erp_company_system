import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default {
    title: "Forms/ResetPasswordForm",
    component: ResetPasswordForm,
} as ComponentMeta<typeof ResetPasswordForm>;

const Template: ComponentStory<typeof ResetPasswordForm> = (args) => (
    <ResetPasswordForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = { onSubmit: (data) => console.log(data) };
