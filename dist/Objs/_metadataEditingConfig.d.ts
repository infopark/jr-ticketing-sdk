export declare const metadataEditingConfigAttributes: {
    metaDataDescription: {
        title: string;
        description: string;
    };
    robotsIndex: {
        title: string;
        description: string;
        values: {
            value: string;
            title: string;
        }[];
    };
};
export declare const metadataInitialContent: {
    robotsIndex: string;
};
export declare const metadataPropertiesGroups: ({
    title: string;
    properties: string[];
    component?: undefined;
} | {
    title: string;
    component: string;
    properties: string[];
})[];
export declare const metadataValidations: ((string | ((metaDataDescription: any) => {
    message: string;
    severity: string;
} | undefined))[] | ((obj: any) => {
    message: string;
    severity: string;
} | undefined))[];
