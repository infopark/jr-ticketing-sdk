import React, { useState } from "react";
import * as Scrivito from "scrivito";
import classNames from "classnames";
import { useUserData } from "./UserDataContext";
import { callApiPost } from "../api/portalApiCalls";
import getUserData from "../api/getUserData";
import { translate } from "../utils/translate";
import { getLanguage, getLanguageVersions, getLinkForVersion } from "../utils/page";

const LanguageSwitcher = () => {
  const { userData, updateUserData } = useUserData();

  const currentLanguage = getLanguage();
  const versions = getLanguageVersions();

  const persistLanguage = async (lang) => {
    if (userData.language === lang) {
      return;
    }
    const response = await callApiPost(`update-user/${userData.userid}`, {
      language: lang,
      timelocale: lang,
    });
    if (response) {
      if (!response.failedRequest) {
        const data = await getUserData();
        updateUserData(data);
      }
    }
  };
  return (
    <>
      <hr />
      {versions.map((version) => {
        const lang = version.language();
        const link = new Scrivito.Link({ url: getLinkForVersion(version), target: null as any });
        return (
          <Scrivito.LinkTag
            to={(currentLanguage !== lang ? link : Scrivito.currentPage()) as any}
            target={null as any}
            key={lang}
            title={lang}
            onClick={() => persistLanguage(lang)}
          >
            <i
              className={classNames("fa mr-3", {
                "fa-dot-circle-o": currentLanguage === lang,
                "fa-circle-o": currentLanguage !== lang,
              })}
            />
            <span>{translate(lang as any)}</span>
          </Scrivito.LinkTag>
        );
      })}
    </>
  );
};

export default Scrivito.connect(LanguageSwitcher);
