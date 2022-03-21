import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { IPFilesForm } from "./IPFilesForm";
import { Provider } from "react-redux";
import { makeStore } from "store";

export default {
    title: "Forms/IPFilesForm",
    component: IPFilesForm,
} as ComponentMeta<typeof IPFilesForm>;

const Template: ComponentStory<typeof IPFilesForm> = (args) => (
    <Provider store={makeStore()}>
        <IPFilesForm {...args} />
    </Provider>
);

export const Primary = Template.bind({});
Primary.args = {
    backButtonOnClick: () => console.log("back"),
    onSubmit: (data) => {
        console.log(data);
    },
};
