/* eslint-disable no-console */
import React, { useState, useEffect, useCallback } from "react";
import getUserData from "../api/getUserData";
import useAPIError from "../utils/useAPIError";
import { setUserUuid, removeUserUuid } from "./Auth/utils";

const UserDataContext = React.createContext({} as any);

export function UserDataProvider(props) {
  const [userData, setUserData] = useState(undefined as any);
  const { addError } = useAPIError();

  useEffect(() => {
    const handleDataFetching = async () => {
      try {
        const data = await getUserData();
        if (!data) {
          removeUserUuid();
          return;
        }

        if (data.failedRequest) {
          removeUserUuid();
          if (data.tooManyIamRedirects) {
            setUserData(data);
          }
          return;
        }

        setUserUuid(data.id);
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
      {props.children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  return React.useContext(UserDataContext);
}
