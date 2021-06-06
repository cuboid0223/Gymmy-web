import React, { useState, useEffect } from "react";
import SidebarRow from "./SidebarRow";
import { useStateValue } from "../../StateProvider";

import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import FitnessCenterIcon from "@material-ui/icons/FitnessCenter";
import HistoryIcon from "@material-ui/icons/History";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import AddIcon from "@material-ui/icons/Add";
import SettingsIcon from "@material-ui/icons/Settings";
import FlagIcon from "@material-ui/icons/Flag";
import HelpIcon from "@material-ui/icons/Help";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import EventIcon from "@material-ui/icons/Event";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import PoolIcon from "@material-ui/icons/Pool";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { Link, NavLink, useHistory } from "react-router-dom";
import db, { auth } from "../../firebase";
import { actionTypes } from "../../reducer";
import { useAuthState } from "react-firebase-hooks/auth";
import SidebarRowsList from "./SidebarRowsList";

const Sidebar = () => {
  const [newSidebarName, setNewSidebarName] = useState("");

  const [editFormOpen, setEditFormOpen] = useState(false);

  const [{ isSidebarOpen }, dispatch] = useStateValue();
  const [userLoggedIn] = useAuthState(auth);
  const history = useHistory();
  const userVideoCategoriesRef = db
    .collection("users")
    .doc(userLoggedIn?.uid)
    .collection("videoCategories");
  // when click submit -> (CheckBoxIcon)
  const addSidebarRow = () => {
    userVideoCategoriesRef.add({ name: newSidebarName });
  };

  // 登出功能 傳給 sidebarRow component
  const logout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("logout!");
        // 將使用者去除
        // 將通知去除
        dispatch(
          {
            type: actionTypes.SET_USER,
            user: null,
          },
          {
            type: actionTypes.SET_NOTICES,
            notices: null,
          }
        );
        history.push("/login");
      })
      .catch((error) => console.log(error.message));
  };

  // close the sidebar edit Form

  // useEffect(() => {
  //   setEditFormOpen(false);
  // }, [newSidebarNames]);

  const addNewSidebarName = (event) => {
    setNewSidebarName(event.target.value);
  };

  return (
    <div>
      {userLoggedIn ? (
        <div
          className={`sidebar ${
            isSidebarOpen ? "sidebarActive" : "sidebarDisabled"
          }`}
        >
          <NavLink exact to="/" activeClassName="selected">
            <SidebarRow Icon={EventIcon} title="Calendar" />
          </NavLink>

          {/* <NavLink exact to="/calendar" activeClassName="selected">
            <SidebarRow Icon={EventIcon} title="Calendar" />
          </NavLink> */}

          <hr />
          <h4>Video Categories</h4>
          <NavLink exact to="/search" activeClassName="selected">
            {userLoggedIn && (
              <SidebarRowsList
                isDeleteIconShow={false}
                IsDisabledSearch_f={false}
              />
            )}

            {/* <SidebarRow
          Icon={FitnessCenterIcon}
          title="Weight Training"
          tutorial={true}
        />
        <SidebarRow
          Icon={DirectionsBikeIcon}
          title="Spinning Bike"
          tutorial={true}
        />
        <SidebarRow Icon={PoolIcon} title="Swimming" tutorial={true} /> */}
          </NavLink>

          {/* user can add own sidebar after login*/}
          {userLoggedIn && (
            <div
              className="addSidebarRow"
              onClick={() => setEditFormOpen(true)}
            >
              <AddIcon className="sidebar-row__icon" />
              <h2
                className={
                  editFormOpen
                    ? "sidebar-row__title-disabled"
                    : "sidebar-row__title"
                }
              >
                Add Own Item
              </h2>
              <form
                className={
                  editFormOpen
                    ? "addSidebarRow__form"
                    : "addSidebarRow__form-disabled"
                }
              >
                <input
                  type="text"
                  value={newSidebarName}
                  onChange={addNewSidebarName}
                />
                {newSidebarName && <CheckBoxIcon onClick={addSidebarRow} />}
              </form>
            </div>
          )}

          <hr />
          <h4>More GYMMY functions</h4>
          <NavLink exact to="/guessMealNutrition" activeClassName="selected">
            <SidebarRow
              imageUrl="https://img.icons8.com/ios-filled/100/000000/light-on.png"
              title="GuessMealNutrition"
            />
          </NavLink>

          <Link to="/mealPlan">
            <SidebarRow
              imageUrl="https://img.icons8.com/ios/50/000000/knife-and-spatchula.png"
              title="MealPlan"
            />
          </Link>
          <Link to="/pickUpRobot">
            <SidebarRow
              title="Pekka"
              imageUrl="https://img.icons8.com/ios/50/000000/bot.png"
            />
          </Link>
          <hr />

          {userLoggedIn && (
            <>
              <Link to="/setting">
                <SidebarRow Icon={SettingsIcon} title="Settings" />
              </Link>
              <Link to="/profile">
                <SidebarRow Icon={AccountCircleIcon} title="Profile" />
              </Link>
            </>
          )}

          {!userLoggedIn ? ( // 沒有登入才顯示登入按鈕
            <Link to="/login">
              <SidebarRow Icon={VpnKeyIcon} title="Login" />
            </Link>
          ) : (
            // 有登入才顯示登出按鈕
            <SidebarRow
              Icon={ExitToAppIcon}
              title="Logout"
              color
              logout={logout}
            />
          )}

          <hr />
          <div className="sidebar__footer">
            {/* <a href="#">關於</a>
        <a href="#">新聞中心</a>
        <a href="#">版權</a>
        <a href="#">與我們聯絡</a>
        <a href="#">創作者</a>
        <a href="#">廣告</a>
        <a href="#">開發人員</a> */}

            {/* <div className="sidebar__terms">
          <a href="#">條款</a>
          <a href="#">隱私權</a>
          <a href="#">政策與安全性</a>
          <a href="#">YouTube 運作方式</a>
          <a href="#">測試新功能</a>
        </div> */}
          </div>

          <div className="sidebar__copyRight">© 2021 Gymmy </div>
        </div>
      ) : null}
    </div>
  );
};

export default Sidebar;
