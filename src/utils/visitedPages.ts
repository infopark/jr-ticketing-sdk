import * as Scrivito from "scrivito";
import { some } from "lodash-es";

const storage = window.localStorage;

const trackedPageTypes = ["TrainingPage", "ChatPage"];

const getEssentialObjInfo = (obj) => {
  if (!obj) {
    return null;
  }
  const baseUrl = Scrivito.urlFor(obj);
  const id = obj && obj.id();
  const pageType = obj && obj.objClass();
  const query = window.location.search;
  const url = query ? `${baseUrl}${query}` : baseUrl;
  const title = obj && obj.get("title");
  const language = obj && obj.siteId();
  return { id, url, query, title, pageType, language };
};

const getVisitedPages = (obj) => {
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
const isInVisitedPages = (obj) => {
  if (!obj) {
    return null;
  }
  const objInfo = getEssentialObjInfo(obj);
  const visitedArray = JSON.parse(getVisitedPages(obj) as any);
  return some(visitedArray, objInfo);
};

const addToVisitedPages = (obj) => {
  if (!obj) {
    return null;
  }
  const currentPage = Scrivito.currentPage();
  const lang = currentPage && currentPage.siteId();
  const objInfo = getEssentialObjInfo(obj) as any;
  const visited = getVisitedPages(obj);
  const visitedArray = JSON.parse(visited as any);
  const localisedVisitedArray =
    lang && visitedArray && visitedArray.filter((o) => (o && o.language) === lang);
  if (!(!objInfo.query && objInfo.pageType === "ChatPage")) {
    localisedVisitedArray.unshift(objInfo);
  }

  if (localisedVisitedArray.length > 5) {
    localisedVisitedArray.pop();
  }

  return storage.setItem("visitedPages", JSON.stringify(localisedVisitedArray));
};

export { getVisitedPages, isInVisitedPages, addToVisitedPages };
