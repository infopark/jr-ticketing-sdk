import useAPIError from "../utils/useAPIError";
import React, { useState } from "react";
import { useUserData } from "./UserDataContext";
import Honeybadger from "@honeybadger-io/js";

export default function ErrorNotification() {
  const { error, removeError } = useAPIError();
  const [showDetails, setShowDetails] = useState(false);
  const { userData } = useUserData();

  const handleClose = () => {
    removeError();
    setShowDetails(false);
  };

  const handleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (!error) {
    return null;
  }

  if (error) {
    const { component } = error;
    Honeybadger.notify(error.errorObj, {
      message: `${error.message} ${error.errorObj}`,
      context: {
        userData,
        component,
      },
    });
  }
  return (
    <div className="error-notification d-none">
      <div className="text-right">
        <i className="fa fa-times c_pointer" onClick={handleClose}></i>
      </div>
      <div className="mb-3">
        <span className="inline-block mr-2" style={{ fontSize: "18px" }}>
          <i className="fa fa-exclamation-circle"></i>
        </span>
        <span className="semi_bold">
          Unfortunately something went wrong. Please try again later
        </span>
      </div>
      <div className="mb-2 c_pointer" onClick={handleDetails}>
        Show details
      </div>
      {showDetails && (
        <div className="error-details">{`${error.message} ${error.errorObj}`}</div>
      )}
    </div>
  );
}
