import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ProgressBar } from "./ProgressBar";

export default {
    title: "Components/ProgressBar",
    component: ProgressBar,
} as ComponentMeta<typeof ProgressBar>;

const Template: ComponentStory<typeof ProgressBar> = (args) => <ProgressBar {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    progress: 30,
};
