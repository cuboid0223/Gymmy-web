import React, { useState } from "react";

const SettingItem = ({ name }) => {
  const localStorageValue = localStorage.getItem(name);
  const [itemBoolean, setItemBoolean] = useState(JSON.parse(localStorageValue));

  const setItem = () => {
    if (itemBoolean) {
      setItemBoolean(false);
      localStorage.setItem(name, false);
    } else {
      setItemBoolean(true);
      localStorage.setItem(name, true);
    }
  };

  return (
    <div className="settingItem">
      <p>{name}</p>
      <input
        type="checkbox"
        className="settingItem__switch"
        onChange={setItem}
        checked={JSON.parse(localStorageValue)}
      />
    </div>
  );
};

export default SettingItem;
