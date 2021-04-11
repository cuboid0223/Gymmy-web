import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import Card from "./Card";

const CalendarPage = () => {
  const [{ totalCalories }, dispatch] = useStateValue();
  const [date, onDateChange] = useState(new Date());
  // console.log(date); // 日期

  useEffect(() => {
    if (!date) return;
    console.log("send date");
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
      <Card type="breakfast" date={date} category="food" />
      {/* 中餐 */}
      <Card type="lunch" date={date} category="food" />
      {/* 晚餐 */}
      <Card type="dinner" date={date} category="food" />
      {/* 點心 */}
      <Card type="snack" date={date} category="food" />
      <hr />
      {/* 運動 */}
      <Card type="sports" date={date} />
      {/* 其他 */}
      <Card type="others" date={date} />
    </div>
  );
};

export default CalendarPage;
