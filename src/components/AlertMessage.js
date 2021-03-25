import React from "react";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
// import HighlightOffIcon from "@material-ui/icons/HighlightOff";

const AlertMessage = ({ message }) => {
  return (
    <>
      {message ? (
        <div className="alertMessage">
          <div className="alertMessage__leftBox">
            <ErrorOutlineIcon />
            <p>{message}</p>
          </div>
          {/* <HighlightOffIcon /> */}
        </div>
      ) : null}
    </>
  );
};

export default AlertMessage;
