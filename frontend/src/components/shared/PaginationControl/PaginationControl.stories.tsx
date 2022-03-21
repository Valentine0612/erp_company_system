import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PaginationControl } from "./PaginationControl";

export default {
    title: "Components/PaginationControl",
    component: PaginationControl,
} as ComponentMeta<typeof PaginationControl>;

const Template: ComponentStory<typeof PaginationControl> = (args) => <PaginationControl {...args} />;

export const PrimaryPaginationControl = Template.bind({});
PrimaryPaginationControl.args = { itemsCount: 100 };
