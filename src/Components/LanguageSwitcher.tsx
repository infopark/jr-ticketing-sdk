import React, { useState } from "react";
import * as Scrivito from "scrivito";
import classNames from "classnames";
import { useUserData } from "./UserDataContext";
import { languages } from "../api/utils";
import { callApiPost } from "../api/portalApiCalls";
import getUserData from "../api/getUserData";
import { translate } from "../utils/translate";
import { getPageLinkInLanguage, getLanguage } from "../utils/page";

const LanguageSwitcher = () => {
  const { userData, updateUserData } = useUserData();
  const [currentLanguage, setCurrentLanguage] = useState<string|null>(null);
  const [alternate, setAlternate] = useState<string|null>(null);

  Scrivito.load(() => {
    const lang = getLanguage();
    const alt =
      lang &&
      getPageLinkInLanguage(lang === "portalEn" ? "portalDe" : "portalEn");
    const availableAlt = alt && !alt.startsWith("#SCRIVITO_UNAVAILABLE");
    setCurrentLanguage(lang);
    if (alt && availableAlt) {
      setAlternate(alt);
    }
  });

  if (!alternate) {
    return null;
  }
  const persistLanguage = async (lang) => {
    if (userData.language === lang.iso) {
      return;
    }
    const response = await callApiPost(`update-user/${userData.userid}`, {
      language: lang.iso,
      timelocale: lang.iso,
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
      {languages.map((lang) => {
        const link =
          alternate && new Scrivito.Link({ url: alternate, target: null as any });
        return (
          <Scrivito.LinkTag
            to={(currentLanguage !== lang.siteId ? link : Scrivito.currentPage()) as any}
            target={null as any}
            key={lang.siteId}
            title={lang.siteId}
            onClick={() => persistLanguage(lang)}
          >
            <i
              className={classNames("fa mr-3", {
                "fa-dot-circle-o": currentLanguage === lang.siteId,
                "fa-circle-o": currentLanguage !== lang.siteId,
              })}
            />
            <span>{translate(lang.siteId as any)}</span>
          </Scrivito.LinkTag>
        );
      })}
    </>
  );
};

export default Scrivito.connect(LanguageSwitcher);
