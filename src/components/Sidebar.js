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
import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import YouTubeIcon from "@material-ui/icons/YouTube";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import CompassCalibrationIcon from "@material-ui/icons/CompassCalibration";
import SettingsIcon from "@material-ui/icons/Settings";
import FlagIcon from "@material-ui/icons/Flag";
import HelpIcon from "@material-ui/icons/Help";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <SidebarRow selected Icon={HomeIcon} title="首頁" />
      <SidebarRow Icon={WhatshotIcon} title="發燒影片" />
      <SidebarRow Icon={SubscriptionsIcon} title="訂閱內容" />
      <hr />
      <SidebarRow Icon={FitnessCenterIcon} title="舉重" tutorial={true} />
      <SidebarRow Icon={HistoryIcon} title="飛輪" tutorial={true} />
      <SidebarRow Icon={OndemandVideoIcon} title="啞鈴" tutorial={true} />
      <SidebarRow Icon={WatchLaterIcon} title="游泳" tutorial={true} />
      <SidebarRow Icon={ThumbUpAltIcon} title="自主訓練" tutorial={true} />
      <SidebarRow
        Icon={ExpandMoreOutlinedIcon}
        title="顯示更多"
        tutorial={true}
      />
      <hr />
      <h4>更多 YOUTUBE 內容</h4>
      <SidebarRow Icon={YouTubeIcon} title="YouTube Premium" />
      <SidebarRow Icon={SportsEsportsIcon} title="遊戲" />
      <SidebarRow Icon={CompassCalibrationIcon} title="直播" />
      <hr />
      <SidebarRow Icon={SettingsIcon} title="設定" />
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

      <div className="sidebar__copyRight">© 2020 Google LLC</div>
    </div>
  );
};

export default Sidebar;
