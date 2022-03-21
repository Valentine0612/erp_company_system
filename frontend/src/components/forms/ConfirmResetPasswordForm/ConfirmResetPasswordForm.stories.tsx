import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ConfirmResetPasswordForm } from "./ConfirmResetPasswordForm";

export default {
    title: "Forms/ConfirmResetPasswordForm",
    component: ConfirmResetPasswordForm,
} as ComponentMeta<typeof ConfirmResetPasswordForm>;

const Template: ComponentStory<typeof ConfirmResetPasswordForm> = (args) => (
    <ConfirmResetPasswordForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = { onSubmit: (data) => console.log(data) };
