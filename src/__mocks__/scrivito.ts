import React from "react";

export const provideComponent = () => null;

export const createWidgetClass = () => null;

export const createObjClass = ({ attributes }) => {
  return class ObjClass {
    get(name) {
      return attributes[name];
    }
    path() {
      return attributes["_path"];
    }
  };
};

export let currentSiteId = () => "portalEn";

export const provideWidgetClass = () => null;

export const registerComponent = () => null;

export const getClass = () => null;

export const openDialog = () => null;

export const load = () => {
  return {
    then: () => {
      return;
    },
  };
};

export const Link = (attr) => ({
  url: () => attr.url,
  obj: () => attr.obj,
  title: () => attr.title,
  isInternal: () => (attr.obj ? true : false),
});

export const Obj = {
  siteId: "default",
  where: function (attribute, operator, value) {
    if (operator === "startsWith") {
      return { siteId: this.siteId, [attribute]: value };
    }

    return { siteId: this.siteId };
  },
  onSite: function (siteId) {
    if (siteId) {
      return { siteId, where: this.where };
    }

    return { siteId: this.siteId, where: this.where };
  },
};

export const connect = (component) => component;

export const isInPlaceEditingActive = () => true;

export const isComparisonActive = () => true;

export const isEditorLoggedIn = () => false;

export const configure = () => true;

export const unstable_selectSiteId = () => undefined;
