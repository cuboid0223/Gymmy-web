import React from "react";

const FoodListItem = ({ food }) => {
  return (
    <div className="foodListItem" >
      <div>
        <p className="foodListItem__title">{food?.name}</p>
        <p className="foodListItem__brand-unit">
          {food?.brand} {food?.serving}
          {food?.serving_unit}
        </p>
      </div>
      <div className="foodListItem__cal">{food?.calories} cal</div>
    </div>
  );
};

export default FoodListItem;
