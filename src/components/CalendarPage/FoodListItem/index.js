import React from "react";

const FoodListItem = () => {
  return (
    <div className="foodListItem">
      <div>
        <p className="foodListItem__title">卡拉雞腿堡</p>
        <p className="foodListItem__brand-unit">肯德雞 一份</p>
      </div>
      <div className='foodListItem__cal'>445 cal</div>
    </div>
  );
};

export default FoodListItem;
