import { ReactNode } from "react";
import { CompanyDocument } from "types/Company";
import { TaskDocument } from "types/Task";
import { UserDocument } from "types/UserDocument";

export type DocumentsTableProps = {
    tableTitle?: string;
    documents: Array<TaskDocument | UserDocument | CompanyDocument>;

    tableClassName?: string;
    tableLineClassName?: string;

    tableLineInner?: (document: TaskDocument | UserDocument | CompanyDocument) => ReactNode;
};
