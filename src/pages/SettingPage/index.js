import React from "react";
import SettingItem from "./SettingItem";

const SettingPage = () => {
  return (
    <div className="settingPage">
      <SettingItem name="Calendar Pro" />
      <SettingItem name="Dark Mode" />
      <SettingItem name="Delete Video Categories" />
    </div>
  );
};

export default SettingPage;
