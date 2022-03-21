import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { AlertionWrapper } from "./AlertionWrapper";
import { Provider, useDispatch } from "react-redux";
import { makeStore } from "store";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";

export default {
    title: "Wrappers/AlertionWrapper",
    component: AlertionWrapper,
} as ComponentMeta<typeof AlertionWrapper>;

const Template: ComponentStory<typeof AlertionWrapper> = (args) => (
    <Provider store={makeStore()}>
        <AlertionWrapper {...args} />
    </Provider>
);

export const Primary = Template.bind({});
Primary.args = {
    children: <Child />,
};

function Child() {
    const dispatch = useDispatch();

    return (
        <>
            <button onClick={() => dispatch(AlertionActionCreator.createAlerion("Success alertion"))}>
                Open success alertion
            </button>

            <button onClick={() => dispatch(AlertionActionCreator.createAlerion("Error alertion", "error"))}>
                Open error alertion
            </button>
        </>
    );
}
