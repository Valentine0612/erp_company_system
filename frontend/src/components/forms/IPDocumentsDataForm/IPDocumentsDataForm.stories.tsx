import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { IPDocumentsDataForm } from "./IPDocumentsDataForm";

export default {
    title: "Forms/IPDocumentsDataForm",
    component: IPDocumentsDataForm,
} as ComponentMeta<typeof IPDocumentsDataForm>;

const Template: ComponentStory<typeof IPDocumentsDataForm> = (args) => <IPDocumentsDataForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    onSubmit: (data) => {
        console.log(data);
    },
};
