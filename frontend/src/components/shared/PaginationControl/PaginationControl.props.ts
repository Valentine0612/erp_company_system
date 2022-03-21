export type PaginationControlProps = {
    itemsCount: number;
    itemsPerPage?: number;

    defaultPage?: number;
    shownPagesCellsCount?: number;

    onPageSelected?: (pageNumber: number) => void;
};
