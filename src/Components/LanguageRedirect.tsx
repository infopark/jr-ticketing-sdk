import React from "react";
import * as Scrivito from "scrivito";
import {
  setUserLanguageHandledFlag,
  userLanguageHandled,
} from "./Auth/utils";
import { useUserData } from "./UserDataContext";

const LanguageRedirect = ({ initialLanguage, alternate, defaultAlternate }) => {
  const { userData } = useUserData();
  const userLanguage = userData && userData.language;
  const userLanguageIsDe = userLanguage && userLanguage.startsWith("de") || false;
  const userLanguageIsEn = userLanguage && userLanguage.startsWith("en") || false;
  const wasUserLanguageHandled = userLanguageHandled();

  const shouldRedirect =
    (!wasUserLanguageHandled &&
      userLanguageIsDe &&
      initialLanguage !== "de") ||
    (!wasUserLanguageHandled &&
      userLanguageIsEn &&
      initialLanguage !== "en");

  const shouldRedirectToDefault =
    !userLanguageIsDe && !userLanguageIsEn && initialLanguage !== "en";

  if (userData && !wasUserLanguageHandled) {
    setUserLanguageHandledFlag();
  }

  if (wasUserLanguageHandled || !userLanguage || !alternate) {
    return null;
  }

  if (shouldRedirect && alternate) {
    window.location.href = alternate;
    return <></>;
  }

  if (shouldRedirectToDefault && defaultAlternate) {
    window.location.href = defaultAlternate;
    return <></>;
  }
};

export default Scrivito.connect(LanguageRedirect as any) as any;
