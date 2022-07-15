import * as Scrivito from "scrivito";
import { find } from "lodash";

const getPage = (className, callback, language) => {
  Scrivito.load(() => {
    const version = getLanguageVersion(language);
    const siteId = version && version.siteId();
    const siteContext = siteId && Scrivito.Obj.onSite(siteId);
    const searchObject = siteId ? siteContext : Scrivito.Obj;
    return (searchObject as any).where("_objClass", "equals", className).first();
  }).then((page) => (callback ? callback(page) : page));
};

const getLanguage = () => {
  const current = Scrivito.currentPage();
  const language = current && current.language();
  return language;
};

const getPageLinkInLanguage = (language) => {
  const version = getLanguageVersion(language);
  if (!version) {
    return null;
  }
  return Scrivito.urlFor(version, {
    query: window.location.search,
  });
};

const getLanguageVersions = () => {
  const current = Scrivito.currentPage();
  if (!current) {
    return [];
  }
  return current.versionsOnAllSites();
}

const getLanguageVersion = (language) => {
  const versions = getLanguageVersions();
  return find(versions, version => version.language() === language);
}

export {
  getPage,
  getLanguage,
  getPageLinkInLanguage,
};
