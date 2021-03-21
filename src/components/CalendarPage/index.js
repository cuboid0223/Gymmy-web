import React, { useState } from "react";
import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import FoodList from "./FoodList";
const CalendarPage = () => {
  const [value, onChange] = useState(new Date());
  // console.log(value);
  return (
    <div className="calendarPage">
      <Calendar
        className="calendarPage__calendar"
        onChange={onChange}
        value={value}
      />

      <div className="caloriesCalculator">
        <h3>還剩卡路里</h3>
        <div className="caloriesCalculator__container">
          <div>
            2390 <p>目標</p>
          </div>
          <pre> - </pre>
          <div>
            45<p>食品</p>
          </div>
          <pre> - </pre>
          <div>
            19<p>運動</p>
          </div>
          <pre> = </pre>
          <div>
            1964<p>剩餘</p>
          </div>
        </div>
      </div>

      {/* 早餐 */}
      <FoodList type="早餐" />
      {/* 中餐 */}
      <FoodList type="中餐" />
      {/* 晚餐 */}
      <FoodList type="晚餐" />
      {/* 點心 */}
      <FoodList type="點心" />
      {/* 運動 */}
      <FoodList type="運動" />
    </div>
  );
};

export default CalendarPage;
