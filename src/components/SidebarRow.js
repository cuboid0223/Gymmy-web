import React from "react";
// React Context API
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";

const SidebarRow = ({ selected, Icon, title, tutorial, imageUrl }) => {
  const [{}, dispatch] = useStateValue();
  return (
    <div
      className={`sidebar-row ${selected && "selected"}`}
      onClick={() => {
        console.log("click");
        if (tutorial) {
          dispatch({
            type: actionTypes.SET_SEARCH_TERM,
            term: title + "教學", //把搜尋的字串丟到 Global State（contextAPI）
          });
        }
      }}
    >
      {imageUrl ? (
        <img className='sidebar-row__imageUrl' src={imageUrl} />
      ) : (
        <Icon className="sidebar-row__icon" />
      )}

      <h2 className="sidebar-row__title">{title}</h2>
    </div>
  );
};

export default SidebarRow;
