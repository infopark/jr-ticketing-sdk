import * as Scrivito from "scrivito";

const isRoot = (obj) => (obj ? obj.id() === Scrivito.Obj.root()!.id() : null);

const isClass = (obj, name) => (obj ? obj.objClass() === name : null);

const isProfilePage = (obj) => (obj ? isClass(obj, "ProfilePage") : null);

const isChatPage = (obj) => (obj ? isClass(obj, "ChatPage") : null);

const isTrainingPage = (obj) => (obj ? isClass(obj, "TrainingPage") : null);

const isTrainingHomePage = (obj) =>
  obj ? isClass(obj, "TrainingHomePage") : null;

const getParent = (obj) => (obj ? obj && obj.parent() : null);

const getGrandParent = (obj) => (obj ? getParent(obj) && getParent(obj).parent() : null);

const isLesson = (obj) =>
  obj
    ? isTrainingPage(getGrandParent(obj)) &&
      isTrainingHomePage(getGrandParent(obj) && getGrandParent(obj).parent())
    : null;

const isActive = (obj) =>
  obj ? obj.id() === Scrivito.currentPage() && Scrivito.currentPage()!.id() : false;

const inActivePath = (obj, currentPage) => {
  if (!obj) {
    return false;
  }
  if (!currentPage) {
    return false;
  }
  const currentPath = currentPage.path();
  if (!currentPath) {
    return false;
  }
  return currentPath.startsWith(obj.path());
};

const getHomepage = (siteId) =>
  [...Scrivito.Obj.onSite(siteId).where("_objClass", "equals", "Homepage") as any][0];

const isActiveTrainingHomePage = (obj) => {
  const current = Scrivito.currentPage();
  return obj ? isLesson(current) && isTrainingHomePage(obj) : null;
};

const excludeFromNavigation = (obj) => {
  if (!obj) {
    return true;
  }
  const excludedTypes = [
    "AddTicketPage",
    "ChatPage",
    "ProfilePage",
    "TicketFormPage",
    "TrainingHomePage",
    "DocumentationHomePage",
    "DocumentationPage",
    "LogoutPage",
  ];
  const pageType = obj.objClass();
  const manualExclude = obj.get("hideFromNav") || obj.get("isStructureFolder");
  return excludedTypes.includes(pageType) || manualExclude;
};

const hasChildren = (obj) => obj.children().length > 0;

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

const getPageLinkInLanguage = (siteId) => {
  const current = Scrivito.currentPage();
  return Scrivito.urlFor(((current as any).versionOnSite(siteId) as any), {
    query: window.location.search,
  });
};

const uniqObjList = (objList) => {
  const idList: string[] = [];
  const result: any[] = [];
  objList.forEach((obj) => {
    if (idList.indexOf(obj.id()) === -1) {
      idList.push(obj.id());
      result.push(obj);
    }
  });
  return Object.values(result);
};

export {
  inActivePath,
  isRoot,
  isActive,
  isProfilePage,
  hasChildren,
  excludeFromNavigation,
  isChatPage,
  isTrainingPage,
  isTrainingHomePage,
  isLesson,
  getPage,
  getParent,
  getGrandParent,
  getHomepage,
  getPageLinkInLanguage,
  getLanguage,
  isActiveTrainingHomePage,
  uniqObjList,
};
