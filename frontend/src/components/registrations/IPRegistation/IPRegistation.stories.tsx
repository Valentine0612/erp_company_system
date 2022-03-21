import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { IPRegistation } from "./IPRegistation";
import { Provider } from "react-redux";
import { makeStore } from "store";

export default {
    title: "Regisrations/IPRegistation",
    component: IPRegistation,
} as ComponentMeta<typeof IPRegistation>;

const Template: ComponentStory<typeof IPRegistation> = () => (
    <Provider store={makeStore()}>
        <IPRegistation />
    </Provider>
);

export const Primary = Template.bind({});
Primary.args = {};
