import React, { useState, useEffect } from "react";
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import VideoCallSharpIcon from "@material-ui/icons/VideoCallSharp";
import AppsSharpIcon from "@material-ui/icons/AppsSharp";
import NotificationsSharpIcon from "@material-ui/icons/NotificationsSharp";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import { Avatar, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import Logo from "../assets/gymmy.png";

const Header = ({ onFormSubmit }) => {
  const [inputSearch, setInputSearch] = useState("");

  const [
    { term, noticesCount, notices, isSidebarOpen },
    dispatch,
  ] = useStateValue(); // 取得 header__NoticeIconCount
  console.log("noticesCount: ", noticesCount);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(inputSearch);
  };
  
  useEffect(() => {
    dispatch({
      type: actionTypes.SET_NOTICESCOUNT,
      noticesCount: notices?.length,
    });
  }, [notices]);

  useEffect(() => {
    console.log("reducer send term: ", term);
    onFormSubmit(term);
  }, [term]);

  const openSidebar = () => {
    dispatch({
      type: actionTypes.SET_IS_SIDEBAR_OPEN,
      isSidebarOpen: isSidebarOpen ? false : true,
    });
  };

  return (
    <div className="header">
      <div className="header__left" onClick={openSidebar}>
        <MenuIcon className="burgerIcon" />
        <Link to="/">
          <img className="header__logo" src={Logo} alt="Logo" />
        </Link>
      </div>

      <form className="header__center" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="搜尋"
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
        />
        <Button onClick={handleSubmit}>
          <Link to={`/search/${inputSearch}`}>
            <SearchIcon className="header__searchBtn" />
          </Link>
        </Button>
      </form>

      <div className="header__right">
        <Link to="/noticePage">
          <div className="header__NoticeIconContainer">
            <NotificationsSharpIcon className="header__NoticeIcon" />
            {noticesCount ? (
              <pre className="header__NoticeIconCount">{noticesCount}</pre>
            ) : null}
          </div>
        </Link>

        {/* <Avatar /> */}
      </div>
    </div>
  );
};

export default Header;
