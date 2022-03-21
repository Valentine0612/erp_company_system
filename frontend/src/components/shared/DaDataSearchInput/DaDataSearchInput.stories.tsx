import React from "react";
import { Meta, Story } from "@storybook/react";
import { DaDataSearchInput, DaDataSearchInputProps } from ".";

export default {
    component: DaDataSearchInput,
    title: "Components/DaDataSearchInput",
} as Meta;

type DaDataSearchInputExampleType = { value: string };
const Template: Story<DaDataSearchInputProps<DaDataSearchInputExampleType>> = (args) => <DaDataSearchInput {...args} />;

export const PrimaryDaDataSearchInput = Template.bind({});
PrimaryDaDataSearchInput.args = {
    onSelect: (item: DaDataSearchInputExampleType) => {
        alert(item.value);
    },
    onUnfoundClick: () => {
        alert("Не найдено");
    },
    unfoundClickText: "Не найдено",
    searchItems: async (query: string) => {
        return new Array(5).fill(1).map((_, index) => {
            return { value: query + "__" + index };
        });
    },
    itemKey: "DaDataSearchInputExampleType",
    itemComponent: (item) => <div>{item.value}</div>,
};
