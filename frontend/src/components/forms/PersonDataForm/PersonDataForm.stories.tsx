import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PersonDataForm } from "./PersonDataForm";

export default {
    title: "Forms/PersonDataForm",
    component: PersonDataForm,
} as ComponentMeta<typeof PersonDataForm>;

const Template: ComponentStory<typeof PersonDataForm> = (args) => <PersonDataForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    onSubmit: (data) => {
        console.log(data);
    },
};
