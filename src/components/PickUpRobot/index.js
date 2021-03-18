import React, { useState, useEffect } from "react";
import SendIcon from "@material-ui/icons/Send";
import { IconButton } from "@material-ui/core";
const PickUpRobot = () => {
  const [userText, setUserText] = useState("");
  const [sendText, setSendText] = useState("");
  const [robotText, setRobotText] = useState("");
  //   console.log(userText);
  const sendTextFunc = (e) => {
    e.preventDefault();
    console.log("sendText");

    setSendText(userText);
    console.log(sendText);
    setUserText(" "); // clear input file
  };
  // request
  return (
    <div className="pickUpRobot">
      {/* message container  */}
      <div className="pickUpRobot__messageContainer">
        {/* robot avatar */}
        <div className="pickUpRobot__robotText">
          <p>Robot text</p>
        </div>
        {/* user avatar */}
        {/* input text */}
        {sendText !== "" ? (
          <div className="pickUpRobot__userText">
            <p>{sendText}</p>
          </div>
        ) : (
          ""
        )}
      </div>

      <form className="pickUpRobot__inputContainer" onSubmit={sendTextFunc}>
        <input
          type="text"
          placeholder="Ask something!"
          onChange={(e) => {
            setUserText(e.target.value);
          }}
        />
        <IconButton type="submit" onClick={sendTextFunc}>
          <SendIcon fontSize="large" />
        </IconButton>
      </form>

      {/* send icon */}
    </div>
  );
};

export default PickUpRobot;
