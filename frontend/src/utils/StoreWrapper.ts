/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextPageContext } from "next";
import { PageCallback } from "next-redux-wrapper";
import { IState, wrapper } from "store";
import { AppStore } from "store/store";
import { AuthStartUp } from "./AuthStartUp";

export class StoreWrapper {
    static getInitialPageProps: StoreWrapperGetInitialPageProps = (properties, callback) => {
        return wrapper.getInitialPageProps((store) => async (context) => {
            await AuthStartUp(store, context);

            if (properties.notAuthenticatedRedirect && !store.getState().user.isAuthenticated) {
                context.res?.writeHead(302, { Location: properties.notAuthenticatedRedirect });
                context.res?.end();
                return;
            } else if (properties.authenticatedRedirect && store.getState().user.isAuthenticated) {
                context.res?.writeHead(302, { Location: properties.authenticatedRedirect });
                context.res?.end();
                return;
            }

            if (
                properties.hasQueryParams &&
                properties.hasQueryParams.params.find(
                    (param) => !(context.query[param] && typeof context.query[param] === "string")
                )
            ) {
                context.res?.writeHead(302, { Location: properties.hasQueryParams.redirectLocation });
                context.res?.end();
                return;
            }

            if (properties.storeRedirect && properties.storeRedirect.redirect(store.getState(), context)) {
                context.res?.writeHead(302, { Location: properties.storeRedirect.redirectLocation });
                context.res?.end();
                return;
            }

            if (!callback) return;

            const nextCallback = callback(store);
            if (!nextCallback) return nextCallback;

            return nextCallback(context);
        });
    };
}

export type StoreWrapperGetInitialPageProps = <PageProps = any>(
    properties: StoreWrapperDefaultGetInitialPagePropsProperties,
    callback?: PageCallback<AppStore, PageProps>
) => ((context: NextPageContext<AppStore>) => PageProps | Promise<PageProps>) | undefined;

export type StoreWrapperDefaultGetInitialPagePropsProperties = {
    notAuthenticatedRedirect?: string;
    authenticatedRedirect?: string;
    storeRedirect?: {
        redirect: (state: IState, context: NextPageContext<AppStore>) => boolean;
        redirectLocation: string;
    };
    hasQueryParams?: { params: Array<string>; redirectLocation: string };
};
