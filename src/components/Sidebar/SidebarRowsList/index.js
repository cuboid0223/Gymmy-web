import React, { useState, useEffect } from "react";
import SidebarRow from "../SidebarRow";
import GradeIcon from "@material-ui/icons/Grade";
import db, { auth } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const SidebarRowsList = ({ isDeleteIconShow, IsDisabledSearch_f }) => {
  const [newSidebarNames, setNewSidebarNames] = useState([]);
  const [userLoggedIn] = useAuthState(auth);
  const userVideoCategoriesRef = db
    .collection("users")
    .doc(userLoggedIn.uid)
    .collection("videoCategories");

  const findVideoCategories = () => {
    userVideoCategoriesRef.onSnapshot((snapshot) =>
      setNewSidebarNames(
        snapshot.docs.map((doc) => Object.assign({ id: doc.id }, doc.data()))
      )
    );
  };

  // 每當 sidebar 出現我就執行裡面的程式碼
  useEffect(() => {
    findVideoCategories();
  }, []);

  return (
    <div className="sidebarRowsList">
      {newSidebarNames.map((newSidebarName) => (
        <SidebarRow
          key={newSidebarName.id}
          videoCategoryUID={newSidebarName.id}
          Icon={GradeIcon}
          title={newSidebarName.name}
          tutorial={true}
          isDeleteIconShow={isDeleteIconShow}
          IsDisabledSearch_f={IsDisabledSearch_f}
        />
      ))}
    </div>
  );
};

export default SidebarRowsList;
