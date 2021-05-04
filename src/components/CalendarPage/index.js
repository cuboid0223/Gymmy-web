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
    // month = date.getMonth()
    // find the plans in the {month} from db
    // list the date from startDate to endDate(array) (date.getDate())
    // like [22,23,24,25,26,27,28,29,30,1,2]

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
    planRef
      .where("start_date", ">=", monthFirstDay)
      .where("start_date", "<=", monthLastDay)
      .onSnapshot((snapshot) =>
        setPlans(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })))
      );
  };

  const changePlanDayRangeColor = (date, plansDateRange, view) => {
    for (let i = plansDateRange[0]; i <= plansDateRange[1]; i++) {
      if (view === "month" && date.getDate() === i) {
        return "tile_active";
      }
      return;
    }
  };

  useEffect(() => {
    if (!plans) return;

    //取得 秒數 from 1970 (unix)
    const plansStartDate = plans[0].data.start_date.seconds * 1000;
    const plansEndDate = plans[0].data.end_date.seconds * 1000;

    setPlansDateRange([plansStartDate, plansEndDate]);
  }, [plans]);
  //console.log(plansDateRange);
  //console.log(plans);
  return (
    <div className="calendarPage">
      <Calendar
        className="calendarPage__calendar"
        onChange={onDateChange}
        value={date}
        allowPartialRange={true}
        // selectRange={true}
        tileClassName={
          ({ date, view }) => {
            if (!plansDateRange) {
              return;
            } else {
              if (
                date.valueOf() >= plansDateRange[0] &&
                date.valueOf() <= plansDateRange[1]
              ) {
                return "tile_active";
              }
              return;
            }
          }

          // view === "month" && date.getDate() === 3 && date.getMonth() === 4
          //   ? "tile_active"
          //   : null
        }
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
