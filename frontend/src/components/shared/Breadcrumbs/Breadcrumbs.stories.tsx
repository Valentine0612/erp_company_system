import React from "react";
import { Meta, Story } from "@storybook/react";
import { Breadcrumbs } from ".";
import { BreadcrumbsProps } from "./Breadcrumbs.props";
import { RoutesCreator } from "utils/RoutesCreator";

export default {
    component: Breadcrumbs,
    title: "Components/Breadcrumbs",
} as Meta;

const Template: Story<BreadcrumbsProps> = (args: BreadcrumbsProps) => <Breadcrumbs {...args} />;

export const PrimaryBreadcrumbs = Template.bind({});
PrimaryBreadcrumbs.args = {
    list: [
        { text: "Кабинет менеджера", url: RoutesCreator.getManagerRoute() },
        { text: "Задания", url: RoutesCreator.getManagerAllTasksRoute() },
    ],
};
