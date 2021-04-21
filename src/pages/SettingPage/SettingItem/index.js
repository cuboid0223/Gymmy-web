import React, { useState } from "react";

const SettingItem = ({ name }) => {
  return (
    <div className="settingItem">
      <p>{name}</p>
      <input type="checkbox" className="settingItem__switch"></input>
    </div>
  );
};

export default SettingItem;
