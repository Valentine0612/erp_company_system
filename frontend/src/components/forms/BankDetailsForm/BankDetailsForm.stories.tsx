import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BankDetailsForm } from "./BankDetailsForm";

export default {
    title: "Forms/BankDetailsForm",
    component: BankDetailsForm,
} as ComponentMeta<typeof BankDetailsForm>;

const Template: ComponentStory<typeof BankDetailsForm> = (args) => <BankDetailsForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    backButtonOnClick: () => console.log("back"),
    onSubmit: (data) => {
        console.log(data);
    },
};
