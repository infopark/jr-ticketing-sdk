declare const typesDictionary: {
    CORRESPONDENCE: {
        icon: string;
        name: string;
    };
    TASK: {
        icon: string;
        name: string;
    };
    MEMO: {
        icon: string;
        name: string;
    };
    CALL: {
        icon: string;
        name: string;
    };
    APPOINTMENT: {
        icon: string;
        name: string;
    };
};
declare const matchIconToType: (type: any) => any;
declare const activityTypes: string[];
export { matchIconToType, activityTypes, typesDictionary };
