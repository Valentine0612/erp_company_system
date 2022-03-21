import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { RIGFilesForm } from "./RIGFilesForm";
import { Provider } from "react-redux";
import { makeStore } from "store";

export default {
    title: "Forms/RIGFilesForm",
    component: RIGFilesForm,
} as ComponentMeta<typeof RIGFilesForm>;

const Template: ComponentStory<typeof RIGFilesForm> = (args) => (
    <Provider store={makeStore()}>
        <RIGFilesForm {...args} />
    </Provider>
);

export const Primary = Template.bind({});
Primary.args = {
    backButtonOnClick: () => console.log("back"),
    onSubmit: (data) => {
        console.log(data);
    },
};
