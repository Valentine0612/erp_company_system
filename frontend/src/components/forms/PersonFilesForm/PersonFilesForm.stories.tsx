import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PersonFilesForm } from "./PersonFilesForm";
import { Provider } from "react-redux";
import { makeStore } from "store";

export default {
    title: "Forms/PersonFilesForm",
    component: PersonFilesForm,
} as ComponentMeta<typeof PersonFilesForm>;

const Template: ComponentStory<typeof PersonFilesForm> = (args) => (
    <Provider store={makeStore()}>
        <PersonFilesForm {...args} />
    </Provider>
);

export const Primary = Template.bind({});
Primary.args = {
    backButtonOnClick: () => console.log("back"),
    onSubmit: (data) => {
        console.log(data);
    },
};
