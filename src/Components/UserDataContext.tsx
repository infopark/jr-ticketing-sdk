/* eslint-disable no-console */
import React, { useState, useEffect, useCallback } from "react";
import { Router, Route, useHistory } from "react-router-dom";
import getUserData from "../api/getUserData";
import useAPIError from "../utils/useAPIError";
import { setLoggedIn, setUserUuid, removeUserUuid } from "./Auth/utils";

const UserDataContext = React.createContext({} as any);

export function UserDataProvider(props) {
  const history = useHistory();
  const [userData, setUserData] = useState(undefined as any);
  const { addError } = useAPIError();
  useEffect(() => {
    const handleDataFetching = async () => {
      try {
        const data = await getUserData();
        if (!data) {
          setLoggedIn(false);
          removeUserUuid();
          return;
        }

        if (data.failedRequest) {
          setLoggedIn(false);
          removeUserUuid();
          if (data.tooManyIamRedirects) {
            setUserData(data);
          }
          return;
        }

        setLoggedIn(true);
        setUserUuid(data.userid);
        setUserData(data);
      } catch (error) {
        addError("LOAD_DATA_ERROR, ", error, "UserDataContext");
      }
    };
    handleDataFetching();
  }, [addError]);

  const updateUserData = useCallback((data) => {
    setUserData(data);
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        userData,
        updateUserData,
      }}
    >
      {userData && userData.visit ? (
        <Router history={history}>
          <Route
            path="/"
            component={() => {
              window.location.href = userData.visit;
              return null;
            }}
          />
        </Router>
      ) : (
        props.children
      )}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  return React.useContext(UserDataContext);
}
