import { DocumentsTableProps } from "./DocumentsTable.props";
import { Table } from "components/shared";
import { FilesAPI } from "api/FilesAPI";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { useDispatch } from "react-redux";
import styles from "./DocumentsTable.module.scss";
import { TaskDocument } from "types/Task";
import { UserDocument } from "types/UserDocument";
import { CompanyDocument } from "types/Company";

export const DocumentsTable = (props: DocumentsTableProps) => {
    const dispatch = useDispatch();

    async function openDocument(document: TaskDocument | UserDocument | CompanyDocument) {
        let documentURL = "";

        if (Object.prototype.hasOwnProperty.call(document, "file")) documentURL = (document as TaskDocument).file;
        if (Object.prototype.hasOwnProperty.call(document, "image")) documentURL = (document as UserDocument).image;
        if (Object.prototype.hasOwnProperty.call(document, "document"))
            documentURL = (document as CompanyDocument).document;

        const result = await FilesAPI.getFile(documentURL);

        if (result.status !== 200) {
            dispatch(AlertionActionCreator.createAlerion("Ошибка", "error"));
            return console.log(result);
        }

        const contractURL = URL.createObjectURL(result.data);
        window.open(contractURL, "_blank");
    }

    return (
        <Table className={[styles.table, props.tableClassName || ""].join(" ")} withoutHeader={!props.tableTitle}>
            {props.tableTitle && (
                <div className={[styles.tableLine, styles.tableHeader].join(" ")}>{props.tableTitle}</div>
            )}

            {(props.documents.length &&
                props.documents.map((document, index) => (
                    <div
                        className={[styles.tableLine, props.tableLineClassName || ""].join(" ")}
                        key={"DocumentsTable__item__" + index}
                        onClick={() => openDocument(document)}
                    >
                        {props.tableLineInner ? props.tableLineInner(document) : document.title}
                    </div>
                ))) || <div className={styles.tableLine}>Пока нет документов</div>}
        </Table>
    );
};
