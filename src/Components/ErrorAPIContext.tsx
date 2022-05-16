import React, { useState, useCallback } from "react";

export const ErrorAPIContext = React.createContext({
  error: null as any,
  addError: (() => {}) as any,
  removeError: () => {},
});

export default function ErrorAPIProvider({ children }) {
  const [error, setError] = useState(null as any);

  const removeError = () => setError(null);

  const addError = (message, errorObj, component) =>
    setError({ message, errorObj, component });

  const contextValue = {
    error,
    addError: useCallback(
      (message, errorObj, component) => addError(message, errorObj, component),
      []
    ),
    removeError: useCallback(() => removeError(), []),
  };

  return (
    <ErrorAPIContext.Provider value={contextValue}>
      {children}
    </ErrorAPIContext.Provider>
  );
}
