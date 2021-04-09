import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import FoodList from "./FoodList";

const CalendarPage = () => {
  const [{}, dispatch] = useStateValue();
  const [date, onDateChange] = useState(new Date());
  // console.log(date); // 日期

  useEffect(() => {
    // 傳送日期
    dispatch({
      type: actionTypes.SET_DATE,
      date: date,
    });
  }, [date]);

  return (
    <div className="calendarPage">
      <Calendar
        className="calendarPage__calendar"
        onChange={onDateChange}
        value={date}
      />

      <div className="caloriesCalculator">
        <h3>surplus calories</h3>
        <div className="caloriesCalculator__container">
          <div>
            2390 <p>target</p>
          </div>
          <pre> - </pre>
          <div>
            45<p>foods</p>
          </div>
          <pre> + </pre>
          <div>
            19<p>sports</p>
          </div>
          <pre> = </pre>
          <div>
            1964<p>surplus</p>
          </div>
        </div>
      </div>

      {/* 早餐 */}
      <FoodList type="breakfast" />
      {/* 中餐 */}
      <FoodList type="lunch" />
      {/* 晚餐 */}
      <FoodList type="dinner" />
      {/* 點心 */}
      <FoodList type="snack" />
      {/* 運動 */}
      <FoodList type="sports" />
    </div>
  );
};

export default CalendarPage;
