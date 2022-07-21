import * as Scrivito from "scrivito";
import { find } from "lodash";
import { get2LetterLanguage } from "./translate";

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
  return getLinkForVersion(version);
};

const getLanguageVersions: () => Scrivito.Obj<any>[] = () => {
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

const getLinkForVersion = (version) => {
  return Scrivito.urlFor(version, {
    query: window.location.search,
  });
}

const getLanguageVersionForUser = (userLanguage: string, defaultLanguage = "en"): Scrivito.Obj<any> | undefined => {
  const versions = getLanguageVersions();
  let version: Scrivito.Obj<any> | undefined;

  if (userLanguage) {
    if (!version) {
      version = find(versions, version => version.language() === userLanguage);
    }
    if (!version) {
      version = find(versions, version => get2LetterLanguage(version.language()) === get2LetterLanguage(userLanguage));
    }
  }

  if (defaultLanguage) {
    if (!version) {
      version = find(versions, version => version.language() === defaultLanguage);
    }
    if (!version) {
      version = find(versions, version => get2LetterLanguage(version.language()) === get2LetterLanguage(defaultLanguage));
    }
  }

  if (!version) {
    version = versions[0];
  }

  return version;
}

export {
  getPage,
  getLanguage,
  getPageLinkInLanguage,
  getLanguageVersions,
  getLanguageVersion,
  getLinkForVersion,
  getLanguageVersionForUser,
};
