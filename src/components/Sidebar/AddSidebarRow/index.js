import React, { useState } from "react";
import { useStateValue } from "../../../StateProvider";
import { actionTypes } from "../../../reducer";

import CheckBoxIcon from "@material-ui/icons/CheckBox";
import AddIcon from "@material-ui/icons/Add";

const AddSidebarRow = ({ addSidebarRow }) => {
  const [newSidebarName, setNewSidebarName] = useState("");
  const [editFormOpen, setEditFormOpen] = useState(false);
  //   const [{}, dispatch] = useStateValue();

  //   const addSidebarRow = (e) => {
  //     e.preventDefault();

  //     console.log("newSidebarName: ", newSidebarName);
  //     dispatch({
  //       type: actionTypes.SET_NEWSIDEBARROW_NAMES,
  //       newSidebarRowNames: [newSidebarName], //把搜尋的字串丟到 Global State（contextAPI）
  //     });
  //     // sessionStorage.setItem("newSidebarNames", [newSidebarName]);
  //     setEditFormOpen(false);
  //     setNewSidebarName("");
  //   };;

  return (
    <div className="addSidebarRow" onClick={() => setEditFormOpen(true)}>
      <AddIcon className="sidebar-row__icon" />
      <h2
        className={
          editFormOpen ? "sidebar-row__title-disabled" : "sidebar-row__title"
        }
      >
        Add Own Item
      </h2>
      <form
        className={
          editFormOpen ? "addSidebarRow__form" : "addSidebarRow__form-disabled"
        }
      >
        <input
          type="text"
          value={newSidebarName}
          onChange={(e) => setNewSidebarName(e.target.value)}
        />
        {newSidebarName && <CheckBoxIcon onClick={addSidebarRow} />}
      </form>
    </div>
  );
};

export default AddSidebarRow;
