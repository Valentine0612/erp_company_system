import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { AccountPageWrapper } from "./AccountPageWrapper";
import { Provider } from "react-redux";
import { makeStore } from "store";

export default {
    title: "Wrappers/AccountPageWrapper",
    component: AccountPageWrapper,
} as ComponentMeta<typeof AccountPageWrapper>;

const Template: ComponentStory<typeof AccountPageWrapper> = (args) => (
    <Provider store={makeStore()}>
        <AccountPageWrapper {...args} />
    </Provider>
);

export const Primary = Template.bind({});
Primary.args = {
    children: (
        <>
            <div>dsadawda</div>
            <div>dsadawda</div>
            <div>dsadawda</div>
            <div>dsadawda</div>
            <div>dsadawda</div>
            <div>dsadawda</div>
            <div>dsadawda</div>
            <div>dsadawda</div>
        </>
    ),
};
