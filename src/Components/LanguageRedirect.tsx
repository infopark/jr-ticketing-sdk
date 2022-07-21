import React, { useEffect, useState } from "react";
import * as Scrivito from "scrivito";
import { getLanguage, getLanguageVersionForUser, getLinkForVersion } from "../utils/page";
import { setUserLanguageHandledFlag, userLanguageHandled } from "./Auth/utils";
import { useUserData } from "./UserDataContext";

export interface LanguageRedirectParams {
  initialLanguage: string | null;
  targetLanguage?: string | null;
  targetPath?: string | null;
}

function LanguageRedirectWrapper() {
  const { userData } = useUserData();
  const [redirectParams, setRedirectParams] = useState<LanguageRedirectParams|null>(null);

  useEffect(() => {
    Scrivito.load(() => {
      const initialLanguage = getLanguage();
      const version = getLanguageVersionForUser(userData && userData.language);
      if (!version) {
        return null;
      }
      const targetLanguage = version.language();
      const targetPath = stripOrigin(getLinkForVersion(version));
      return {
        initialLanguage,
        targetLanguage,
        targetPath
      };
    }).then((loadedValues) => {
      setRedirectParams(loadedValues);
    });
  }, [userData])

  if (!redirectParams || !userData || userLanguageHandled()) {
    return null;
  }

  setUserLanguageHandledFlag();

  if (redirectParams.initialLanguage === redirectParams.targetLanguage) {
    return null
  }

  window.location.href = redirectParams.targetPath!;

  return <></>;
}

function stripOrigin(url: string): string {
  if (!url) {
    return url;
  }
  return url.replace(window.location.origin, '');
}

export default Scrivito.connect(LanguageRedirectWrapper);
