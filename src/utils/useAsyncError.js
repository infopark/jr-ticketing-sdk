import React from "react";

/**
 * @see https://medium.com/trabe/catching-asynchronous-errors-in-react-using-error-boundaries-5e8a5fd7b971
 */
const useAsyncError = () => {
  const [_, setError] = React.useState();

  return React.useCallback(
    (e) => {
      setError(() => {
        throw e;
      });
    },
    [setError]
  );
};

export default useAsyncError;
