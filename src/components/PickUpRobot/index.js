import React, { useState, useEffect } from "react";
import SendIcon from "@material-ui/icons/Send";
import { IconButton } from "@material-ui/core";
import axios from "axios";
import FlipMove from "react-flip-move";

const PickUpRobot = () => {
  const [isUser, setIsUser] = useState(true); // 還沒接後端 先用 true false 替代
  const [inputText, setInputText] = useState(""); // 未傳送的訊息
  const [sendText, setSendText] = useState([]); // 已傳送的訊息
  const [messages, setMessages] = useState([]);
  //   const [robotAnswers, setRobotAnswers] = useState([]);
  //console.log("sendText: ", sendText);

  const sendTextFunc = (e) => {
    e.preventDefault();
    //console.log("inputText: ", inputText);
    setSendText([...sendText, { message: inputText, user: isUser }]);
    setMessages([...messages, { message: inputText, user: isUser }]);
    //console.log("messages: ", messages);
    //console.log("sendText: ", sendText);
    setInputText(""); // clear input file

    // when add new message, we don't need to scroll down
    var elem = document.getElementById("messageContainer");
    elem.scrollTop = elem.scrollHeight;
  };
  // request
  useEffect(() => {
    if (!sendText) {
      return;
    }
    const options = {
      method: "GET",
      url:
        "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/quickAnswer",
      // 取得陣列最後一個元素，及最新的一條訊息
      params: { q: sendText[sendText.length - 1]?.message },
      headers: {
        "x-rapidapi-key": "561ee6d36amshf73fd6455efaa12p1935aejsn0c7dc81a59b2",
        "x-rapidapi-host":
          "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        //console.log(response.data);
        const ans = response.data.answer;
        const imageUrl = response.data.image;
        setMessages([...messages, { answer: ans, imageUrl: imageUrl }]);
        // setRobotAnswers([...robotAnswers, response.data.answer]);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [sendText]);
  // console.log("messages: ", messages);
  return (
    <div className="pickUpRobot">
      {/* message container  */}
      <div className="pickUpRobot__messageContainer" id="messageContainer">
        <FlipMove>
          {/* robot default message */}
          <div className="pickUpRobot__robotText">
            <p>
              Hey!
              <br />
              I am Pick-Up, you can ask me anything about 'nutrition'.
              <br />
              For example, How much vitamin c is in 2 apples?
            </p>
          </div>
          {messages.map(({ message, answer, user, imageUrl }) => (
            <div
              className={
                //判斷訊息是否人為使用者輸入
                user ? "pickUpRobot__userText" : "pickUpRobot__robotText"
              }
            >
              <p className={!message && "message_display_none"}>{message}</p>
              <p className={!answer && "message_display_none"}>{answer}</p>
              <img
                className={!imageUrl && "message_display_none"}
                src={imageUrl}
                alt="message__image"
              />
            </div>
          ))}
        </FlipMove>
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
        <IconButton
          className="pickUpRobot__sendIcon"
          type="submit"
          onClick={sendTextFunc}
          disabled={!inputText}
        >
          <SendIcon fontSize="large" />
        </IconButton>
      </form>

      {/* send icon */}
    </div>
  );
};

export default PickUpRobot;
