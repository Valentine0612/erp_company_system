import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { StateSwitcher } from "./StateSwitcher";

export default {
    title: "Components/StateSwitcher",
    component: StateSwitcher,
} as ComponentMeta<typeof StateSwitcher>;

const Template: ComponentStory<typeof StateSwitcher> = (args) => <StateSwitcher {...args} />;

export const PrimaryStateSwitcher = Template.bind({});
PrimaryStateSwitcher.args = {};
