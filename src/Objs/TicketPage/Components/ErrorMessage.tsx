import React from "react";

const ErrorMessage = ({ errors, setErrors }) => {
  let message;

  if (errors.downloadFileError) {
    message = "Connection error or file may be corrupted.";
  }

  return (
    <div
      className="alert alert-danger alert-dismissible fade show"
      role="alert"
    >
      {message}
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
        onClick={() => setErrors({})}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};

export default ErrorMessage;
