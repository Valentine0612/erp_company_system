import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { HeadWrapper } from "./HeadWrapper";

export default {
    title: "Wrappers/HeadWrapper",
    component: HeadWrapper,
} as ComponentMeta<typeof HeadWrapper>;

const Template: ComponentStory<typeof HeadWrapper> = (args) => <HeadWrapper {...args} />;

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
