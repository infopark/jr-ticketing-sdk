import React from "react";
import * as Scrivito from "scrivito";
import classNames from "classnames";
import { translate } from "../utils/translate";
import { getLanguageVersions, getLinkForVersion } from "../utils/page";
import i18n from "../config/i18n";

const languageChangedEvent = new Event("language-changed");

const LanguageSwitcher = () => {
  const currentLanguage = i18n.language;
  const versions = getLanguageVersions();

  const currentPage = Scrivito.currentPage();
  let languages = {
    en: currentPage,
    de: currentPage
  }
  versions.forEach((version) => {
    const lang = version.language();
    if (lang) {
      const link = new Scrivito.Link({ url: getLinkForVersion(version), target: null as any });
      languages[lang] = currentLanguage !== lang ? link : currentPage;
    }
  })

  const switchLanguage = (lang: string) => {
    window.localStorage.language = lang;
    window.dispatchEvent(languageChangedEvent);
  }

  return (
    <>
      <hr />
      {Object.entries(languages).map(([lang, link]) => (
        <Scrivito.LinkTag
          to={link}
          target={null as any}
          key={lang}
          title={lang}
          onClick={() => lang && switchLanguage(lang)}
        >
          <i
            className={classNames("fa mr-3", {
              "fa-dot-circle-o": currentLanguage === lang,
              "fa-circle-o": currentLanguage !== lang,
            })}
          />
          <span>{translate(lang as any)}</span>
        </Scrivito.LinkTag>
      ))}
    </>
  );
};

export default Scrivito.connect(LanguageSwitcher);
