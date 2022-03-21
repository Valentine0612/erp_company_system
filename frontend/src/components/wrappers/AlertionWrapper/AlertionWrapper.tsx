import React from "react";
import { AlertionWrapperProps } from "./AlertionWrapperProps";
import { Alertion } from "components/shared/Alertion";

function AlertionWrapper(props: AlertionWrapperProps) {
    return (
        <>
            <Alertion />
            {props.children}
        </>
    );
}

export { AlertionWrapper };
