import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Card } from "./Card";

export default {
    title: "Components/Card",
    component: Card,
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const PrimaryCard = Template.bind({});
PrimaryCard.args = {
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

export const TranparentCard = Template.bind({});
TranparentCard.args = {
    transparent: true,
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
