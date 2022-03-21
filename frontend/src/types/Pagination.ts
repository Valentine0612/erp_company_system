export type Pagination<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<T>;
};

export type PaginationAPIFilter = {
    limit: number;
    offset: number;
};

export const DEFAULT_PAGINATION_LIMIT = 10;

export const defaultPagination: Pagination<never> = {
    count: 0,
    next: null,
    previous: null,
    results: [],
};
