import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CommentForm } from "./CommentForm";

export default {
    title: "Forms/CommentForm",
    component: CommentForm,
} as ComponentMeta<typeof CommentForm>;

const Template: ComponentStory<typeof CommentForm> = (args) => <CommentForm {...args} />;

export const Primary = Template.bind({});
Primary.args = { onSubmit: (data) => console.log(data) };
