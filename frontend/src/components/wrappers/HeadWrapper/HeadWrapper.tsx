import React from "react";
import Head from "next/head";
import { HeadWrapperProps } from "./HeadWrapperProps";

function HeadWrapper(props: HeadWrapperProps) {
    return (
        <>
            <Head>
                <title>CyberPay</title>
            </Head>

            {props.children}
        </>
    );
}

export { HeadWrapper };
