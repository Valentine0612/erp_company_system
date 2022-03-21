import "styles/globals.scss";
import type { AppProps } from "next/app";
import { wrapper } from "store";
import React, { useEffect } from "react";
import { HeadWrapper } from "components/wrappers/HeadWrapper";
import { PopupWrapper } from "components/wrappers/PopupWrapper";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthAPI } from "api/AuthAPI";
import { NextAPIUtils } from "utils/NextAPIUtils";
import { AlertionWrapper } from "components/wrappers/AlertionWrapper";

// Fix huge icons after reload
import "@fortawesome/fontawesome-svg-core/styles.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);

function MyApp({ Component, pageProps }: AppProps) {
    if (typeof String.prototype.replaceAll == "undefined") {
        String.prototype.replaceAll = function (match, replace) {
            return this.replace(new RegExp(match, "g"), () => {
                if (typeof replace === "string") return replace;
                else return replace("");
            });
        };
    }

    useEffect(() => {
        axios.interceptors.response.use(
            (response) => response,
            (err) => {
                const error = err.response;

                if (error.status === 401 && Cookies.get("refresh")) {
                    return AuthAPI.refreshToken()
                        .then(() => {
                            const originalRequestConfig = error.config;
                            originalRequestConfig.headers = NextAPIUtils.getDefaultHeader();
                            return axios.request(originalRequestConfig);
                        })
                        .catch(() => {
                            Cookies.remove("access");
                            Cookies.remove("refresh");
                        });
                } else return error;
            }
        );
    }, []);

    return (
        <HeadWrapper>
            <PopupWrapper>
                <AlertionWrapper>
                    <Component {...pageProps} />
                </AlertionWrapper>
            </PopupWrapper>
        </HeadWrapper>
    );
}

export default wrapper.withRedux(MyApp);
