import React, { useState } from "react";
// React Context API
import { useStateValue } from "../../../StateProvider";
import { actionTypes } from "../../../reducer";

const SidebarRow = ({
  selected,
  Icon,
  title,
  tutorial,
  imageUrl,
  color,
  logout,
}) => {
  const [{ isSidebarOpen }, dispatch] = useStateValue();
  
  return (
    <div
      className={`sidebar-row ${selected && "selected"} ${
        color && "color-red"
      }`}
      onClick={() => {
        console.log("click");
        if (tutorial) {
          // 影片教學
          dispatch({
            type: actionTypes.SET_SEARCH_TERM,
            term: title + "教學", //把搜尋的字串丟到 Global State（contextAPI）
          });
        }
        if (logout) {
          //登出
          logout();
        }
        if (isSidebarOpen) {
          dispatch({
            type: actionTypes.SET_IS_SIDEBAR_OPEN,
            isSidebarOpen: false,
          });
        }
      }}
    >
      {imageUrl ? (
        <img className="sidebar-row__imageUrl" src={imageUrl} />
      ) : (
        <Icon className="sidebar-row__icon" />
      )}

      <h2 className="sidebar-row__title">{title}</h2>
    </div>
  );
};

export default SidebarRow;
