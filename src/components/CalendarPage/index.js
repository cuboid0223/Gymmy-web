import moment from "moment";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useAuthState } from "react-firebase-hooks/auth";
import db, { auth } from "../../firebase";
// import "react-calendar/dist/Calendar.css";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import Card from "./Card";

const CalendarPage = () => {
  const [
    { totalCalories, sportsTotalCalories, targetCalories },
    dispatch,
  ] = useStateValue();
  const [date, onDateChange] = useState(new Date());
  // const startDateOrRange = date.length === 1 ? date[0] : date;
  const [surplusCalories, setSurplusCalories] = useState(0);
  const TDEE = localStorage.getItem("TDEE");
  // console.log(date); // 日期
  const [userLoggedIn] = useAuthState(auth);
  const [plans, setPlans] = useState(null);
  const [plansDateRange, setPlansDateRange] = useState([]);

  useEffect(() => {
    if (!date) return;

    // 傳送日期
    console.log("send date");
    dispatch({
      type: actionTypes.SET_DATE,
      date: date,
    });
    // 選擇其他日期，將其歸零
    dispatch({
      type: actionTypes.SET_TOTAL_CALORIES,
      totalCalories: 0,
    });

    getThisMonthPlans(date);
  }, [date]);

  useEffect(() => {
    const calories = TDEE - totalCalories + sportsTotalCalories;
    setSurplusCalories(calories);
  }, [totalCalories, sportsTotalCalories, targetCalories]);

  const getThisMonthPlans = (date) => {
    const planRef = db
      .collection("users")
      .doc(userLoggedIn.uid) // <- user.uid
      .collection("plans");
    // find the plan in this month
    const monthFirstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthLastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // console.log(monthFirstDay);
    // console.log(monthLastDay);

    // 取得所有計畫dateRange有到達當月任一日期
    // 計畫在每個月可能不只一個
    planRef
      .where("start_date", ">=", monthFirstDay)
      .where("start_date", "<=", monthLastDay)
      .onSnapshot((snapshot) =>
        setPlans(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })))
      );
  };

  useEffect(() => {
    // 在當月有找到符合區間的計劃才計算
    if (!plans) return;
    //取得 計畫開始與結束的秒數 (from 1970 (unix))
    setPlansDateRange(
      plans.map((plan) => [
        ...plansDateRange,
        {
          start: plan.data.start_date.seconds * 1000,
          end: plan.data.end_date.seconds * 1000,
        },
      ])
    );

    // setPlansDateRange([plansStartDate, plansEndDate]);
  }, [plans]);
  //console.log(plansDateRange);
  console.log(plansDateRange);
  return (
    <div className="calendarPage">
      <Calendar
        className="calendarPage__calendar"
        onChange={onDateChange}
        value={date}
        // allowPartialRange={true}
        // selectRange={true}
        tileClassName={({ date, view }) => {
          if (plansDateRange && view === "month") {
            for (let i = 0; i < plansDateRange.length; i++) {
              if (
                date.valueOf() >= plansDateRange[i][0].start &&
                date.valueOf() <= plansDateRange[i][0].end
              ) {
                return "tile_active";
              }
            }
          }
        }}
      />

      <div className="caloriesCalculator">
        <h3>{moment(date).format("L")} surplus calories</h3>
        <div className="caloriesCalculator__container">
          <div>
            {TDEE} <p>target</p>
          </div>
          <pre> - </pre>
          <div>
            {totalCalories}
            <p>foods</p>
          </div>
          <pre> + </pre>
          <div>
            {sportsTotalCalories}
            <p>sports</p>
          </div>
          <pre> = </pre>
          <div>
            {surplusCalories}
            <p>surplus</p>
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
      <Card type="sports" date={date} category="sport" />
    </div>
  );
};

export default CalendarPage;
