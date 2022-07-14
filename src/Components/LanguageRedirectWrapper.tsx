import React, { useEffect, useRef, useState } from "react";
import * as Scrivito from "scrivito";
import { getPageLinkInLanguage, getLanguage } from "../utils/page";
import LanguageRedirect from "./LanguageRedirect";

export interface LanguageRedirectPaths {
  initialLanguage: string | null;
  alternatePath?: string | null;
  defaultPath?: string | null;
}

function LanguageRedirectWrapper() {
  const [readyForRedirect, setReadyForRedirect] = useState(false);
  const [language, setLanguage] = useState<LanguageRedirectPaths|null>(null);

  useEffect(() => {
    Scrivito.load(() : LanguageRedirectPaths => {
      const lang = getLanguage();
      const alt =
        lang &&
        getPageLinkInLanguage(lang === "portalEn" ? "portalDe" : "portalEn");
      const defaultAlt = lang && getPageLinkInLanguage("portalEn");
      const availableAlt = alt && !alt.startsWith("#SCRIVITO_UNAVAILABLE");
      const availableDefaultAlt =
        defaultAlt && !defaultAlt.startsWith("#SCRIVITO_UNAVAILABLE");
      
      if (alt && defaultAlt && availableAlt && availableDefaultAlt) {
        return {
          initialLanguage: lang,
          alternatePath: stripOrigin(alt),
          defaultPath: stripOrigin(defaultAlt)
        };
      }

      return {initialLanguage: lang};
    }).then((lang: LanguageRedirectPaths) => {
      setLanguage(lang);
    });
  }, [])
  
  useEffect(() => {
    setReadyForRedirect(language != null);
  }, [language])

  return (
    <>
      {readyForRedirect && (
        <LanguageRedirect
          initialLanguage={language && language.initialLanguage}
          alternate={language && language.alternatePath}
          defaultAlternate={language && language.defaultPath}
        />
      )}
    </>
  );
}

function stripOrigin(url: string): string {
  if (!url) {
    return url;
  }
  return url.replace(window.location.origin, '');
}

export default Scrivito.connect(LanguageRedirectWrapper);
