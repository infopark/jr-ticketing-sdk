declare const metadataAttributes: {
    metaDataDescription: string;
    robotsIndex: (string | {
        values: string[];
    })[];
    tcCreator: string;
    tcDescription: string;
    tcImage: (string | {
        only: string[];
    })[];
    tcTitle: string;
    ogDescription: string;
    ogImage: (string | {
        only: string[];
    })[];
    ogTitle: string;
};
export default metadataAttributes;
