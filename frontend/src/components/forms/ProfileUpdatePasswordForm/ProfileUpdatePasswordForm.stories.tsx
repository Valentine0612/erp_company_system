import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ProfileUpdatePasswordForm } from "./ProfileUpdatePasswordForm";

export default {
    title: "Forms/ProfileUpdatePasswordForm",
    component: ProfileUpdatePasswordForm,
} as ComponentMeta<typeof ProfileUpdatePasswordForm>;

const Template: ComponentStory<typeof ProfileUpdatePasswordForm> = (args) => (
    <ProfileUpdatePasswordForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = { onSubmit: (data) => console.log(data) };
