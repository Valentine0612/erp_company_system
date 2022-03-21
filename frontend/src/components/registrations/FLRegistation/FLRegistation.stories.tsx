import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { FLRegistation } from "./FLRegistation";
import { Provider } from "react-redux";
import { makeStore } from "store";
import { OccupationTypeEnum } from "enums/OccupationTypeEnum";

export default {
    title: "Regisrations/FLRegistation",
    component: FLRegistation,
} as ComponentMeta<typeof FLRegistation>;

const Template: ComponentStory<typeof FLRegistation> = () => (
    <Provider store={makeStore()}>
        <FLRegistation occupationType={OccupationTypeEnum.FL} />
    </Provider>
);

export const Primary = Template.bind({});
Primary.args = {};
