/* eslint-disable no-console */
import React from "react";
import { translate } from "../utils/translate";
import { callLogout } from "../api/portalApiCalls";
import {
  removeUserUuid,
  removeUserLanguageHandledFlag,
} from "./Auth/utils";

const SignOutLink = () => {
  async function signOut(event) {
    event.preventDefault();
    try {
      removeUserUuid();
      removeUserLanguageHandledFlag();
      callLogout();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }
  return (
    <a href="/" onClick={(event) => signOut(event)}>
      {translate("sign_out")}
    </a>
  );
};

export default SignOutLink;
