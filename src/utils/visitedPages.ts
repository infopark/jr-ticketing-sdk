import * as Scrivito from "scrivito";
import { some } from "lodash-es";

const fakeLocalStorage = {
  getItem: () => {
    // Do nothing
  },
  setItem: () => {
    // Do nothing
  }
};

const storage = typeof window !== "undefined" ? window.localStorage : fakeLocalStorage;

const trackedPageTypes = ["TrainingPage", "TicketPage"];

interface ObjInfo {
  id: string;
  url: string;
  query: string;
  title: string | null;
  pageType: string;
  language: string | null;
}

const getEssentialObjInfo = (obj: Scrivito.Obj): ObjInfo | null => {
  if (!obj) {
    return null;
  }
  const baseUrl = Scrivito.urlFor(obj);
  const id = obj && obj.id();
  const pageType = obj && obj.objClass();
  const query = window.location.search;
  const url = query ? `${baseUrl}${query}` : baseUrl;
  const title = obj && obj.get("title") as string;
  const language = obj && obj.siteId();
  return { id, url, query, title, pageType, language };
};

const getVisitedPages = (obj: Scrivito.Obj | null): string | void | null => {
  if (!obj) {
    return null;
  }
  const pageType = obj.objClass();
  const objInfo = getEssentialObjInfo(obj);

  if (!storage.getItem("visitedPages")) {
    trackedPageTypes.includes(pageType)
      ? storage.setItem("visitedPages", JSON.stringify([objInfo]))
      : storage.setItem("visitedPages", "[]");
  }
  return storage.getItem("visitedPages");
};
const isInVisitedPages = (obj: Scrivito.Obj) => {
  if (!obj) {
    return null;
  }
  const objInfo = getEssentialObjInfo(obj);
  const visitedArray = JSON.parse(getVisitedPages(obj) as string);
  return some(visitedArray, objInfo);
};

const addToVisitedPages = (obj: Scrivito.Obj) => {
  if (!obj) {
    return null;
  }
  const currentPage = Scrivito.currentPage();
  const lang = currentPage && currentPage.siteId();
  const objInfo = getEssentialObjInfo(obj);
  const visited = getVisitedPages(obj);
  const visitedArray = JSON.parse(visited as string);
  const localisedVisitedArray =
    lang && visitedArray && visitedArray.filter((o) => (o && o.language) === lang);
  if (!(!objInfo?.query && objInfo?.pageType === "TicketPage")) {
    localisedVisitedArray.unshift(objInfo);
  }

  if (localisedVisitedArray.length > 5) {
    localisedVisitedArray.pop();
  }

  return storage.setItem("visitedPages", JSON.stringify(localisedVisitedArray));
};

export { getVisitedPages, isInVisitedPages, addToVisitedPages };
