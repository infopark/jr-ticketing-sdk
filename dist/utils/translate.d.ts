import translations from "./translations";
declare const getLanguage: () => any;
declare const getDictionary: (localizations: any, defaultLanguage?: string) => any;
declare const translate: (key: keyof typeof translations.en | keyof typeof translations.de) => string;
declare const dictTranslate: (key: string, dict: any) => any;
export { translate, getLanguage, getDictionary, dictTranslate };
