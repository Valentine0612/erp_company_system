import React from "react";
import { Meta, Story } from "@storybook/react";
import { Selector } from ".";
import { SelectorProps } from "./SelectorProps";
import { MapType } from "types/MapType";

export default {
    component: Selector,
    title: "Components/Selector",
} as Meta;

const Template: Story<SelectorProps<MapType>> = (args: SelectorProps<MapType>) => <Selector {...args} />;

export const PrimarySelector = Template.bind({});
PrimarySelector.args = {
    textKeyName: "name",
    options: [
        { name: "First Element" },
        { name: "Second Element" },
        { name: "Third Element" },
        { name: "Fourth Element" },
    ],
    defaultText: "Choose item",
};

export const SelectorWithDefaultValue = Template.bind({});
SelectorWithDefaultValue.args = {
    textKeyName: "name",
    options: [
        { name: "First Element" },
        { name: "Second Element" },
        { name: "Third Element" },
        { name: "Fourth Element" },
    ],
    defaultText: "Choose item",
    defaultValue: { name: "First Element" },
};

export const ErrorSelector = Template.bind({});
ErrorSelector.args = {
    textKeyName: "name",
    options: [
        { name: "First Element" },
        { name: "Second Element" },
        { name: "Third Element" },
        { name: "Fourth Element" },
    ],
    defaultText: "Choose item",
    error: true,
};

export const HiddenSelector = Template.bind({});
HiddenSelector.args = {
    textKeyName: "name",
    options: [
        { name: "First Element" },
        { name: "Second Element" },
        { name: "Third Element" },
        { name: "Fourth Element" },
    ],
    defaultText: "Choose item",
    hidden: true,
};
