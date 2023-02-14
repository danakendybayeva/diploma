export interface IPageContent {
    content: any[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: IPageAble;
    size: number;
    sort: IPageSort;
    totalElements: number;
    totalPages: number;
}

export interface IPageAble {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: IPageSort;
}

export interface IPageSort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}
