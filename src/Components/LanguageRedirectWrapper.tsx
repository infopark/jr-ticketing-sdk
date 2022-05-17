import React, { useState } from "react";
import * as Scrivito from "scrivito";
import { getPageLinkInLanguage, getLanguage } from "../utils/page";
import LanguageRedirect from "./LanguageRedirect";

function LanguageRedirectWrapper() {
  const [defaultAlternate, setDefaultAlternate] = useState<string|null>(null);
  const [readyForRedirect, setReadyForRedirect] = useState(false);
  const [language, setLanguage] = useState<string|null>(null);
  const [alternate, setAlternate] = useState<string|null>(null);

  Scrivito.load(() => {
    const lang = getLanguage();
    const alt =
      lang &&
      getPageLinkInLanguage(lang === "portalEn" ? "portalDe" : "portalEn");
    const defaultAlt = lang && getPageLinkInLanguage("portalEn");
    const availableAlt = alt && !alt.startsWith("#SCRIVITO_UNAVAILABLE");
    const availableDefaultAlt =
      defaultAlt && !defaultAlt.startsWith("#SCRIVITO_UNAVAILABLE");
    setLanguage(lang);
    if (alt && defaultAlt && availableAlt && availableDefaultAlt) {
      setAlternate(alt);
      setDefaultAlternate(defaultAlt);
    }
  }).then(() => {
    setReadyForRedirect(true);
  });

  return (
    <>
      {readyForRedirect && (
        <LanguageRedirect
          initialLanguage={language}
          alternate={alternate}
          defaultAlternate={defaultAlternate}
        />
      )}
    </>
  );
}

export default Scrivito.connect(LanguageRedirectWrapper);
