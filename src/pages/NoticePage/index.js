import React, { useEffect } from "react";
import NoticeCard from "./NoticeCard";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";

import logo from "../.././assets/logo.JPG";
const NoticePage = () => {
  //   events.map(({ name, start, logo, url, id, description }) => {
  //     const maxChar = 20
  //     if (notice?.message.length > maxChar) {
  //    notice?.message = notice?.message.substring(0, maxChar) + " . . ."
  // }
  const [{ notices }, dispatch] = useStateValue();

  return (
    <div className="noticePage">
      {/* map limit 20 notice cards */}
      {notices?.slice(0, 20).map((notice) => (
        <NoticeCard imageURL={logo} desc={notice?.message} />
      ))}
      {!notices.length && <p>連系統都不會給你訊息....口連 ==</p>}
    </div>
  );
};

export default NoticePage;
