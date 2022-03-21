import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { RegisterOccupationForm } from "./RegisterOccupationForm";

export default {
    title: "Forms/RegisterOccupationForm",
    component: RegisterOccupationForm,
} as ComponentMeta<typeof RegisterOccupationForm>;

const Template: ComponentStory<typeof RegisterOccupationForm> = (args) => (
    <RegisterOccupationForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
    onSubmit: (data) => {
        console.log(data);
    },
};
