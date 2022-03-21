import React from "react";
import { Meta, Story } from "@storybook/react";
import { Alertion } from ".";
import { Provider, useDispatch } from "react-redux";
import { makeStore } from "store";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";

export default {
    component: Alertion,
    title: "Components/Alertion",
} as Meta;

const Template: Story = () => (
    <Provider store={makeStore()}>
        <App />
    </Provider>
);

export const PrimaryAlertion = Template.bind({});
PrimaryAlertion.args = {};

function App() {
    const dispatch = useDispatch();

    return (
        <>
            <Alertion />

            <button onClick={() => dispatch(AlertionActionCreator.createAlerion("Success alertion"))}>
                Open success alertion
            </button>

            <button onClick={() => dispatch(AlertionActionCreator.createAlerion("Error alertion", "error"))}>
                Open error alertion
            </button>
        </>
    );
}
