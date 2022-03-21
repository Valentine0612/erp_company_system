import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { RIGRegistation } from "./RIGRegistation";
import { Provider } from "react-redux";
import { makeStore } from "store";

export default {
    title: "Regisrations/RIGRegistation",
    component: RIGRegistation,
} as ComponentMeta<typeof RIGRegistation>;

const Template: ComponentStory<typeof RIGRegistation> = (args) => (
    <Provider store={makeStore()}>
        <RIGRegistation {...args} />
    </Provider>
);

export const Primary = Template.bind({});
Primary.args = {
    countries: [{ name: "Казахстан" }, { name: "Украина" }, { name: "Киргизия" }],
};
