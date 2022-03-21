import { PaginationControlProps } from "./PaginationControl.props";
import styles from "./PaginationControl.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { DEFAULT_PAGINATION_LIMIT } from "types/Pagination";

export const PaginationControl = (props: PaginationControlProps) => {
    function getPageCount(itemsCount: number) {
        return Math.ceil(itemsCount / (props.itemsPerPage || DEFAULT_PAGINATION_LIMIT));
    }

    function getShownPagesCellsCount(shownPagesCellsCount?: number) {
        return Math.min(
            (shownPagesCellsCount &&
                ((shownPagesCellsCount % 2 === 1 && shownPagesCellsCount) || shownPagesCellsCount + 1)) ||
                9,
            9
        );
    }

    const [pagesCount, setPagesCount] = useState(getPageCount(props.itemsCount));
    const [shownPagesCellsCount, setShownPagesCellsCount] = useState(
        getShownPagesCellsCount(props.shownPagesCellsCount)
    );
    const [currentPage, setCurrentPage] = useState(
        props.defaultPage && props.defaultPage <= pagesCount ? props.defaultPage : 1
    );

    useEffect(() => {
        setPagesCount(getPageCount(props.itemsCount));
        setShownPagesCellsCount(getShownPagesCellsCount(props.shownPagesCellsCount));
        setCurrentPage(1);
        props.onPageSelected && props.onPageSelected(1);
    }, [props.itemsCount, props.shownPagesCellsCount]);

    if (pagesCount <= 1) return <></>;

    function nextOnClicked() {
        if (currentPage !== pagesCount) {
            setCurrentPage(currentPage + 1);
            props.onPageSelected && props.onPageSelected(currentPage + 1);
        }
    }

    function previousOnClicked() {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
            props.onPageSelected && props.onPageSelected(currentPage - 1);
        }
    }

    function getPaginationPageElement(pageNumber: number, withoutKey = false) {
        const keyObject: { key?: string } = {};
        if (!withoutKey) keyObject.key = `PaginationControl__item__${pageNumber}`;

        return (
            <div
                className={[styles.paginatorItems, (currentPage === pageNumber && styles.selectedItem) || ""].join(" ")}
                onClick={() => {
                    setCurrentPage(pageNumber);
                    props.onPageSelected && props.onPageSelected(pageNumber);
                }}
                {...keyObject}
            >
                {pageNumber}
            </div>
        );
    }

    function getPaginationInner() {
        if (pagesCount <= shownPagesCellsCount)
            return <>{new Array(pagesCount).fill(undefined).map((_, index) => getPaginationPageElement(index + 1))}</>;

        if (
            currentPage < Math.floor(shownPagesCellsCount / 2) ||
            currentPage > pagesCount - Math.floor(shownPagesCellsCount / 2)
        )
            return (
                <>
                    {new Array(Math.floor(shownPagesCellsCount / 2))
                        .fill(undefined)
                        .map((_, index) => getPaginationPageElement(index + 1))}

                    <div className={[styles.paginatorItems, styles.notClickable].join(" ")}>{"..."}</div>

                    {new Array(Math.floor(shownPagesCellsCount / 2))
                        .fill(undefined)
                        .map((_, index) =>
                            getPaginationPageElement(pagesCount - Math.floor(shownPagesCellsCount / 2) + index + 1)
                        )}
                </>
            );

        return (
            <>
                {getPaginationPageElement(1, true)}

                <div className={[styles.paginatorItems, styles.notClickable].join(" ")}>{"..."}</div>

                {new Array(shownPagesCellsCount - 4)
                    .fill(undefined)
                    .map((_, index) =>
                        getPaginationPageElement(currentPage - Math.floor((shownPagesCellsCount - 4) / 2) + index)
                    )}

                <div className={[styles.paginatorItems, styles.notClickable].join(" ")}>{"..."}</div>

                {getPaginationPageElement(pagesCount, true)}
            </>
        );
    }

    return (
        <div className={styles.paginator}>
            <div
                className={[styles.paginatorItems, (currentPage === 1 && styles.hidden) || ""].join(" ")}
                onClick={previousOnClicked}
            >
                <FontAwesomeIcon icon={faChevronLeft} />
            </div>

            {getPaginationInner()}

            <div
                className={[styles.paginatorItems, (currentPage === pagesCount && styles.hidden) || ""].join(" ")}
                onClick={nextOnClicked}
            >
                <FontAwesomeIcon icon={faChevronRight} />
            </div>
        </div>
    );
};
