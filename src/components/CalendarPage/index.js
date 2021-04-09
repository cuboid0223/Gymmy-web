import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import FoodList from "./FoodList";

const CalendarPage = () => {
  const [{ totalCalories }, dispatch] = useStateValue();
  const [date, onDateChange] = useState(new Date());
  // console.log(date); // 日期

  useEffect(() => {
    if (!date) return;
    console.log('send date');
    // 傳送日期
    dispatch({
      type: actionTypes.SET_DATE,
      date: date,
    });
    // 選擇其他日期，將其歸零
    dispatch({
      type: actionTypes.SET_TOTAL_CALORIES,
      totalCalories: 0,
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
            {totalCalories}
            <p>foods</p>
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
      <FoodList type="breakfast" date={date}/>
      {/* 中餐 */}
      <FoodList type="lunch" date={date}/>
      {/* 晚餐 */}
      <FoodList type="dinner" date={date}/>
      {/* 點心 */}
      <FoodList type="snack" date={date}/>
      {/* 運動 */}
      <FoodList type="sports" date={date}/>
    </div>
  );
};

export default CalendarPage;
