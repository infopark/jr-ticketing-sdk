import React from "react";
import * as Scrivito from "scrivito";
import { Router, Redirect, useHistory } from "react-router-dom";
import {
  setUserLanguageHandledFlag,
  userLanguageHandled,
} from "./Auth/utils";
import { useUserData } from "./UserDataContext";

const LanguageRedirect = ({ initialLanguage, alternate, defaultAlternate }) => {
  const history = useHistory();
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
    return (
      <Router history={history}>
        <Redirect to={alternate} />
      </Router>
    );
  }

  if (shouldRedirectToDefault && defaultAlternate) {
    return (
      <Router history={history}>
        <Redirect to={defaultAlternate} />
      </Router>
    );
  }
};

export default Scrivito.connect(LanguageRedirect as any) as any;
