import React, { useState } from "react";
import { Avatar } from "@material-ui/core";
import logo from "../../../assets/logo.png";
import { useStateValue } from "../../../StateProvider";
import { actionTypes } from "../../../reducer";
const NoticeCard = ({ imageURL, desc }) => {
  const [active, setActive] = useState(true);
  const [{ notices }, dispatch] = useStateValue();

  const clickCard = () => {
    setActive(false); // remove the background color
    dispatch({
      type: actionTypes.SET_NOTICESCOUNT,
      noticesCount: notices.length - 1,
    });
  };
  return (
    <div
      className={active ? "noticeCard noticeCard__active" : "noticeCard"}
      onClick={clickCard}
    >
      <Avatar src={imageURL} alt="logo" />

      {/* hide the text to "..." when the text is too long */}
      {/* https://dev.to/javaofdoom/neatly-shorten-text-that-is-too-long-to-display-l84 */}
      <p className="noticeCard__desc">{desc}</p>
    </div>
  );
};

export default NoticeCard;
