declare const formReducer: (state: any, event: any) => any;
declare const getTicketTypeFields: (typeOptions: any) => {
    tickettype: {
        tag: string;
        type: null;
        labelName: string;
        placeholder: string;
        selectOptions: never[];
        disabled: boolean;
        tooltip: string;
    };
    title: {
        tag: string;
        type: string;
        labelName: string;
        placeholder: string;
        validations: {
            validator(e: any, constraint: any): boolean;
            constraint: number;
            message: string;
        }[];
    };
    description: {
        tag: string;
        type: null;
        labelName: string;
        placeholder: string;
        validations: {
            validator(e: any, constraint: any): boolean;
            constraint: number;
            message: string;
        }[];
    };
    attachment: {
        tag: string;
        type: string;
        labelName: string;
        placeholder: string;
        hint: string;
        validations: {
            validator(e: any, constraint: any): boolean;
            constraint: number;
            message: string;
        }[];
    };
};
declare const languages: {
    iso: string;
    name: string;
    siteId: string;
}[];
declare const editableUserFields: ({
    label: string;
    name: string;
    editable: boolean;
    options?: undefined;
    type?: undefined;
} | {
    label: string;
    name: string;
    editable: boolean;
    options: {
        value: string;
        name: string;
    }[];
    type: string;
})[];
export { getTicketTypeFields, formReducer, editableUserFields, languages };
