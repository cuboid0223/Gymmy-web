import React from "react";
import FoodListItem from "../FoodListItem";

const FoodList = ({ type }) => {
  return (
    <div className="foodList">
      <div className="foodList__topContainer">
        <p className="foodList__type">{type}</p>
        <p className="foodList__totalCalories">1107 cal</p>
      </div>

      {/* list.map */}
      <FoodListItem />

      <button className='foodList__addFoodButton'>Add Food</button>
    </div>
  );
};

export default FoodList;
