import React from "react";
import { Meta, Story } from "@storybook/react";
import { PassportIssuePlaceSearchInput } from ".";

export default {
    component: PassportIssuePlaceSearchInput,
    title: "Components/PassportIssuePlaceSearchInput",
} as Meta;

const Template: Story = () => <PassportIssuePlaceSearchInput />;

export const PrimaryPassportIssuePlaceSearchInput = Template.bind({});
PrimaryPassportIssuePlaceSearchInput.args = {};
