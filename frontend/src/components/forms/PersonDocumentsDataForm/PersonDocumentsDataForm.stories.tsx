import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PersonDocumentsDataForm } from "./PersonDocumentsDataForm";

export default {
    title: "Forms/PersonDocumentsDataForm",
    component: PersonDocumentsDataForm,
} as ComponentMeta<typeof PersonDocumentsDataForm>;

const Template: ComponentStory<typeof PersonDocumentsDataForm> = (args) => <PersonDocumentsDataForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    onSubmit: (data) => {
        console.log(data);
    },
};
