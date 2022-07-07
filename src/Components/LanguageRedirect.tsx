import React from "react";
import * as Scrivito from "scrivito";
import { Navigate } from "react-router-dom";
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
      initialLanguage !== "portalDe") ||
    (!wasUserLanguageHandled &&
      userLanguageIsEn &&
      initialLanguage !== "portalEn");

  const shouldRedirectToDefault =
    !userLanguageIsDe && !userLanguageIsEn && initialLanguage !== "portalEn";

  if (userData && !wasUserLanguageHandled) {
    setUserLanguageHandledFlag();
  }

  if (wasUserLanguageHandled || !userLanguage || !alternate) {
    return null;
  }

  if (shouldRedirect && alternate) {
    return <Navigate replace to={alternate}></Navigate>
  }

  if (shouldRedirectToDefault && defaultAlternate) {
    return <Navigate replace to={defaultAlternate}></Navigate>;
  }
};

export default Scrivito.connect(LanguageRedirect as any) as any;
