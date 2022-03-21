import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PDFPreviewPopup } from "./PDFPreviewPopup";

export default {
    title: "Popups/PDFPreviewPopup",
    component: PDFPreviewPopup,
} as ComponentMeta<typeof PDFPreviewPopup>;

const Template: ComponentStory<typeof PDFPreviewPopup> = () => <PDFPreviewPopup />;

export const PrimaryPDFPreviewPopup = Template.bind({});
PrimaryPDFPreviewPopup.args = {};
