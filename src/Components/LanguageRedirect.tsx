import React from "react";
import * as Scrivito from "scrivito";
import {
  setUserLanguageHandledFlag,
  userLanguageHandled,
} from "./Auth/utils";
import { useUserData } from "./UserDataContext";
import { Router, Navigate } from "react-router-dom";
import { portalHistory } from "../utils/portalHistory";

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
    return <Router navigator={portalHistory} location={portalHistory.location}>
      <Navigate replace to={alternate}></Navigate>
    </Router>
  }

  if (shouldRedirectToDefault && defaultAlternate) {
    return <Router navigator={portalHistory} location={portalHistory.location}>
      <Navigate replace to={defaultAlternate}></Navigate>
    </Router>;
  }
};

export default Scrivito.connect(LanguageRedirect as any) as any;
