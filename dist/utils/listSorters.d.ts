declare const ticketsListSorters: {
    byCreationDate: {
        sorter(data: any): any;
        label: string;
    };
    reverseByCreationDate: {
        sorter(data: any): any;
        label: string;
    };
};
declare const eventListSorters: {
    byBeginDate: {
        sorter(data: any): any;
        label: string;
    };
    reverseByBeginDate: {
        sorter(data: any): any;
        label: string;
    };
    byTitle: {
        sorter(data: any): any;
        label: string;
    };
    reverseByTitle: {
        sorter(data: any): any;
        label: string;
    };
    byNum: {
        sorter(data: any): any;
        label: string;
    };
    reverseByNum: {
        sorter(data: any): any;
        label: string;
    };
};
export { ticketsListSorters, eventListSorters };
