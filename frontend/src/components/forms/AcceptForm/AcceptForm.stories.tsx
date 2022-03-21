import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { AcceptForm } from "./AcceptForm";

export default {
    title: "Forms/AcceptForm",
    component: AcceptForm,
} as ComponentMeta<typeof AcceptForm>;

const Template: ComponentStory<typeof AcceptForm> = (args) => <AcceptForm {...args} />;

export const Primary = Template.bind({});
Primary.args = { onSubmit: () => console.log("clicked") };
