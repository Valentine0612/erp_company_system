import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { FormPageWrapper } from "./FormPageWrapper";

export default {
    title: "Wrappers/FormPageWrapper",
    component: FormPageWrapper,
} as ComponentMeta<typeof FormPageWrapper>;

const Template: ComponentStory<typeof FormPageWrapper> = (args) => <FormPageWrapper {...args} />;

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
