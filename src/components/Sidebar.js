import React from "react";
import SidebarRow from "./SidebarRow";
import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import FitnessCenterIcon from "@material-ui/icons/FitnessCenter";
import HistoryIcon from "@material-ui/icons/History";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import AddIcon from "@material-ui/icons/Add";
import YouTubeIcon from "@material-ui/icons/YouTube";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import CompassCalibrationIcon from "@material-ui/icons/CompassCalibration";
import SettingsIcon from "@material-ui/icons/Settings";
import FlagIcon from "@material-ui/icons/Flag";
import HelpIcon from "@material-ui/icons/Help";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import KitchenIcon from "@material-ui/icons/Kitchen";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <div className="sidebar">
      <SidebarRow selected Icon={HomeIcon} title="Homepage" />
      <SidebarRow Icon={WhatshotIcon} title="hoto" />
      {/* <SidebarRow Icon={SubscriptionsIcon} title="訂閱內容" /> */}
      <hr />
      <SidebarRow
        Icon={FitnessCenterIcon}
        title="Weight Training"
        tutorial={true}
      />
      <SidebarRow Icon={HistoryIcon} title="Spinning Bike" tutorial={true} />
      <SidebarRow Icon={OndemandVideoIcon} title="Dumbbells" tutorial={true} />
      <SidebarRow Icon={WatchLaterIcon} title="Swim" tutorial={true} />
      <SidebarRow Icon={ThumbUpAltIcon} title="Self-training" tutorial={true} />
      <SidebarRow Icon={AddIcon} title="Add more" />
      <hr />
      <h4>More GYMMY functions</h4>
      <Link to="/guessMealNutrition">
        <SidebarRow
          imageUrl="https://img.icons8.com/ios-filled/100/000000/light-on.png"
          title="GuessMealNutrition"
        />
      </Link>

      <Link to="/mealPlan">
        <SidebarRow
          imageUrl="https://img.icons8.com/ios/50/000000/knife-and-spatchula.png"
          title="MealPlan"
        />
      </Link>
      <Link to="/pickUpRobot">
        <SidebarRow
          title="Pick-up"
          imageUrl="https://img.icons8.com/ios/50/000000/bot.png"
        />
      </Link>
      <hr />
      <SidebarRow Icon={SettingsIcon} title="Settings" />
      <SidebarRow Icon={FlagIcon} title="檢舉紀錄" />
      <SidebarRow Icon={HelpIcon} title="說明" />
      <SidebarRow Icon={QuestionAnswerIcon} title="提供意見" />
      <hr />
      <div className="sidebar__footer">
        <a href="#">關於</a>
        <a href="#">新聞中心</a>
        <a href="#">版權</a>
        <a href="#">與我們聯絡</a>
        <a href="#">創作者</a>
        <a href="#">廣告</a>
        <a href="#">開發人員</a>

        <div className="sidebar__terms">
          <a href="#">條款</a>
          <a href="#">隱私權</a>
          <a href="#">政策與安全性</a>
          <a href="#">YouTube 運作方式</a>
          <a href="#">測試新功能</a>
        </div>
      </div>

      <div className="sidebar__copyRight">© 2021 Gymmy </div>
    </div>
  );
};

export default Sidebar;
