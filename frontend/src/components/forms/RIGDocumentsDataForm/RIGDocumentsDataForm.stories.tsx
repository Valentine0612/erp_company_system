import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { RIGDocumentsDataForm } from "./RIGDocumentsDataForm";

export default {
    title: "Forms/RIGDocumentsDataForm",
    component: RIGDocumentsDataForm,
} as ComponentMeta<typeof RIGDocumentsDataForm>;

const Template: ComponentStory<typeof RIGDocumentsDataForm> = (args) => <RIGDocumentsDataForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    onSubmit: (data) => {
        console.log(data);
    },
    countries: [{ name: "RUS" }, { name: "UKR" }],
};
