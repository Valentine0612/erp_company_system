import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ProfileUpdateInfoForm } from "./ProfileUpdateInfoForm";

export default {
    title: "Forms/ProfileUpdateInfoForm",
    component: ProfileUpdateInfoForm,
} as ComponentMeta<typeof ProfileUpdateInfoForm>;

const Template: ComponentStory<typeof ProfileUpdateInfoForm> = (args) => (
    <ProfileUpdateInfoForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = { onSubmit: (data) => console.log(data) };
