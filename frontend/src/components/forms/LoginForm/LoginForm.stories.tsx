import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LoginForm } from "./LoginForm";

export default {
    title: "Forms/LoginForm",
    component: LoginForm,
} as ComponentMeta<typeof LoginForm>;

const Template: ComponentStory<typeof LoginForm> = (args) => <LoginForm {...args} />;

export const Primary = Template.bind({});
Primary.args = { onSubmit: (data) => console.log(data) };
