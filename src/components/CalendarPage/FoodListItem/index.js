import React from "react";

const FoodListItem = ({ food }) => {
  return (
    <div className="foodListItem">
      <div>
        <p className="foodListItem__title">{food?.data?.name}</p>
        <p className="foodListItem__brand-unit">
          {food?.data?.brand} {food?.data?.serving}
          {food?.data?.serving_unit}
        </p>
      </div>
      <div className="foodListItem__cal">
        {parseInt(food?.data?.calories)} cal
      </div>
    </div>
  );
};

export default FoodListItem;
