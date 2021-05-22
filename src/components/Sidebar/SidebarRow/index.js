import React, { useState } from "react";
// React Context API
import { useStateValue } from "../../../StateProvider";
import { actionTypes } from "../../../reducer";
import CancelIcon from "@material-ui/icons/Cancel";
import db, { auth } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
const SidebarRow = ({
  selected,
  Icon,
  title,
  tutorial,
  imageUrl,
  color,
  logout,
  isDeleteIconShow,
  IsDisabledSearch_f,
  videoCategoryUID,
}) => {
  const [{ isSidebarOpen }, dispatch] = useStateValue();
  const [userLoggedIn] = useAuthState(auth);

  const deleteVideoCategory = () => {
    const videoCategoryRef = db
      .collection("users")
      .doc(userLoggedIn.uid)
      .collection("videoCategories")
      .doc(videoCategoryUID);

    //console.log(videoCategoryRef);

    videoCategoryRef
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  const searchTerm_f = () => {
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
  };

  return (
    <div
      className={`sidebar-row ${selected && "selected"} ${
        color && "color-red"
      }`}
      onClick={!IsDisabledSearch_f ? searchTerm_f : null}
    >
      {imageUrl ? (
        <img className="sidebar-row__imageUrl" src={imageUrl} />
      ) : (
        <Icon className="sidebar-row__icon" />
      )}

      <h2 className="sidebar-row__title">{title}</h2>

      {isDeleteIconShow && <CancelIcon onClick={deleteVideoCategory} />}
    </div>
  );
};

export default SidebarRow;
