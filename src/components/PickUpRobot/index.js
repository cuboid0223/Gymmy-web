import React, { useState, useEffect } from "react";
import SendIcon from "@material-ui/icons/Send";
import { IconButton } from "@material-ui/core";
const PickUpRobot = () => {
  const [inputText, setInputText] = useState("");
  const [sendText, setSendText] = useState([]);
  const [robotText, setRobotText] = useState("");
  //   console.log(userText);
  const sendTextFunc = (e) => {
    e.preventDefault();
    console.log("sendTextFunc");
    console.log("inputText: ", inputText);
    setSendText([...sendText, inputText]);
    // console.log("textArray: ", sendText?.textArray);
    console.log("sendText: ", sendText);
    setInputText(""); // clear input file

    // when add new message, we don't need to scroll down
    var elem = document.getElementById("messageContainer");
    elem.scrollTop = elem.scrollHeight;
  };
  // request
  return (
    <div className="pickUpRobot">
      {/* message container  */}
      <div className="pickUpRobot__messageContainer" id="messageContainer">
        {/* robot avatar */}
        <div className="pickUpRobot__robotText">
          <p>Robot text</p>
        </div>
        {/* user avatar */}
        {/* input text */}
        {sendText.map((text) => (
          <div className="pickUpRobot__userText">
            <p>{text}</p>
          </div>
        ))}
      </div>

      <form className="pickUpRobot__inputContainer" onSubmit={sendTextFunc}>
        <input
          type="text"
          value={inputText}
          placeholder="Ask something!"
          onChange={(e) => {
            setInputText(e.target.value);
          }}
        />
        <IconButton type="submit" onClick={sendTextFunc} disabled={!inputText}>
          <SendIcon fontSize="large" />
        </IconButton>
      </form>

      {/* send icon */}
    </div>
  );
};

export default PickUpRobot;
