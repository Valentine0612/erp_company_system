import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { DocumentsTable } from "./DocumentsTable";

export default {
    title: "Components/DocumentsTable",
    component: DocumentsTable,
} as ComponentMeta<typeof DocumentsTable>;

const Template: ComponentStory<typeof DocumentsTable> = (args) => <DocumentsTable {...args} />;

export const PrimaryDocumentsTable = Template.bind({});
PrimaryDocumentsTable.args = {
    documents: [],
};
