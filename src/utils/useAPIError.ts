import { useContext } from "react";
import { ErrorAPIContext } from "../Components/ErrorAPIContext";

function useAPIError() {
  const { error, addError, removeError } = useContext(ErrorAPIContext);
  return { error, addError, removeError };
}

export default useAPIError;
