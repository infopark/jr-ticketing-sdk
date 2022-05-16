import * as Scrivito from "scrivito";

const getPage = (className, callback, siteId) => {
  Scrivito.load(() => {
    const siteContext = siteId && Scrivito.Obj.onSite(siteId);
    const searchObject = siteId ? siteContext : Scrivito.Obj;
    return searchObject.where("_objClass", "equals", className).first();
  }).then((page) => (callback ? callback(page) : page));
};

const getLanguage = () => {
  const current = Scrivito.currentPage();
  const language = current && current.siteId();
  return language;
};

export {
  getPage,
  getLanguage,
};
