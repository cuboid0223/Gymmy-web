import React, { useState } from "react";
import SidebarRowsList from "../../components/Sidebar/SidebarRowsList";
import SettingItem from "./SettingItem";

const SettingPage = () => {
  const isVideoCategories = localStorage.getItem("Delete Video Categories");

  return (
    <div className="settingPage">
      <SettingItem name="Calendar Pro" />
      <SettingItem name="Dark Mode" />
      <SettingItem name="Delete Video Categories" />

      <SidebarRowsList isDeleteIconShow={true} IsDisabledSearch_f={true} />
    </div>
  );
};

export default SettingPage;
