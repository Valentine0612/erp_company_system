import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { IState } from "store";
import styles from "./PDFPreviewPopup.module.scss";
import { SpecialZoomLevel, Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import { version } from "pdfjs-dist";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { useWindowSize } from "react-use";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export function PDFPreviewPopup() {
    const [viewerHeight, setViewerHeight] = useState("unset");

    const { width, height } = useWindowSize();
    const titleRef = useRef<HTMLHeadingElement>(null);

    const popupStateData = useSelector((state: IState) => state.popup.data as PDFPreviewPopupStateData);

    useEffect(() => {
        if (titleRef.current)
            setViewerHeight(
                `calc(80vh - ${
                    parseInt(getComputedStyle(titleRef.current).marginBottom) +
                    titleRef.current.getBoundingClientRect().height
                }px)`
            );
        else setViewerHeight("unset");
    }, [titleRef.current, width, height]);

    return (
        <>
            <h3 className={styles.popupElement} ref={titleRef}>
                Предпросмотр документа
            </h3>

            <div style={{ height: viewerHeight }}>
                <Worker workerUrl={`//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.employee.js`}>
                    <Viewer
                        fileUrl={popupStateData.file}
                        plugins={[defaultLayoutPlugin()]}
                        defaultScale={SpecialZoomLevel.PageWidth}
                    />
                </Worker>
            </div>
        </>
    );
}

export type PDFPreviewPopupFormData = { code: string };
export type PDFPreviewPopupStateData = { file: string };
