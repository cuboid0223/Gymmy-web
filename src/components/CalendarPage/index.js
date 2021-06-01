import moment from "moment";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useAuthState } from "react-firebase-hooks/auth";
import db, { auth } from "../../firebase";
// import "react-calendar/dist/Calendar.css";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import ListOfPlans from "../Profile/ListOfPlans";
import { IconButton } from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import SettingsIcon from "@material-ui/icons/Settings";
import EventNoteIcon from "@material-ui/icons/EventNote";
import Card from "./Card";
import LoadingPage from "../../pages/LoadingPage";
import SettingItem from "../../pages/SettingPage/SettingItem";

const CalendarPage = () => {
  const [{ totalCalories, sportsTotalCalories, targetCalories }, dispatch] =
    useStateValue();
  const [date, onDateChange] = useState(new Date());
  const dateSeconds = new Date(date).valueOf();
  const [surplusCalories, setSurplusCalories] = useState(0);
  const TDEE = localStorage.getItem("TDEE");
  const userInfo = localStorage.getItem("userInfo");

  const [userLoggedIn] = useAuthState(auth);

  const [plans, setPlans] = useState([]);

  const [planUID, setPlanUID] = useState("");

  const [plansDateRange, setPlansDateRange] = useState([]);
  const [plansListOpen, setPlansListOpen] = useState(false);
  const [settingListOpen, setSettingListOpen] = useState(false);
  const showDoubleView = localStorage.getItem("showDoubleView");
  const showWeekNumbers = localStorage.getItem("showWeekNumbers");
  const plansRef = db
    .collection("users")
    .doc(userLoggedIn.uid) // <- user.uid
    .collection("plans");

  const [planTDEE, setPlanTDEE] = useState(0);

  useEffect(() => {
    if (!date) return;
    // 每當按下日期就執行以下程式碼
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

    getThisMonthPlans();

    displayPlanTDEE(date);
  }, [date]);

  const displayPlanTDEE = (date) => {
    // when I click a date, find the date > plan.start_date and date < plan.endDate
    // if true -> set local storage TDEE as planTDEE
    // else -> set local storage TDEE as default TDEE
    // 2021 5/7 待完成
    const dateSeconds = new Date(date).valueOf();
    const tdee = plans.map((plan) => {
      // console.log(new Date(date).valueOf());

      if (
        dateSeconds >= new Date(plan.start_date.seconds * 1000).valueOf() &&
        dateSeconds <= new Date(plan.end_date.seconds * 1000).valueOf()
      ) {
        //localStorage.setItem("TDEE", JSON.stringify(data))

        //setPlanTDEE(plan.plan_TDEE);
        return plan.plan_TDEE;
      } else {
        setPlanTDEE(0);
      }
    });
    if (tdee) {
      const tdeeRemoveUndefined = tdee.filter(function (el) {
        return el != null;
      });

      setPlanTDEE(tdeeRemoveUndefined);
    }
  };

  useEffect(() => {
    let calories = 0;
    if (planTDEE.length !== 0) {
      calories = planTDEE - totalCalories + sportsTotalCalories;
    } else {
      calories = parseInt(TDEE) - totalCalories + sportsTotalCalories;
    }

    setSurplusCalories(calories);
  }, [totalCalories, sportsTotalCalories, targetCalories, planTDEE]);

  useEffect(() => {
    if (!plans || !date) return;

    // 1. find the date is plan date, and in which plan? need the plan uid
    // 當按下日期，取的此日期是否為 plan的日期，
    // 是，傳送給我 該 plan uid
    // 不是， return

    const PLAN = plans.map((plan) => {
      if (
        plan.start_date.seconds * 1000 <= dateSeconds &&
        plan.end_date.seconds * 1000 >= dateSeconds
      ) {
        // setPlanUID(plan.id);
        return plan.id;
      } else {
        setPlanUID("");
      }
    });
    if (PLAN) {
      const PLANRemoveUndefined = PLAN.filter(function (el) {
        return el != null;
      });
      setPlanUID(PLANRemoveUndefined.toString());
    }
  }, [plans, date]);

  useEffect(() => {
    if (!planUID || !date) return;
    const weight = parseInt(JSON.parse(userInfo).weight);
    const planRef = plansRef.doc(planUID).collection("dates");
    // when every time, the surplusCalories change,
    // we run below code
    // 2. send or merge { date: date, today_calories: surplusCalories, current_weight: weight } to firestore
    const firstTimeDateData = {
      date: date,
      today_calories: totalCalories,
      current_weight: weight,
      avg_calories: planTDEE ? parseInt(planTDEE.toString()) : TDEE,
    };

    //如果之後有更新只可更新卡路里，不能更新體重
    const dateData = {
      date: date,
      today_calories: totalCalories,
      avg_calories: planTDEE ? parseInt(planTDEE.toString()) : TDEE,
    };

    planRef
      // .orderBy("date")
      .where("date", "==", date)
      .get()
      .then((querySnapshot) => {
        console.log(querySnapshot.empty);
        if (querySnapshot.empty) {
          //console.log("no record add item");
          plansRef.doc(planUID).collection("dates").add(firstTimeDateData);
        }
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            //console.log(doc.id, " => ", doc.data());
            planRef.doc(doc.id).set(dateData, { merge: true });
          }
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    //plansRef.doc(planUID).collection("dates").add(dateData, { merge: true });
  }, [date, planUID]);

  const getThisMonthPlans = () => {
    // find the plan in this month
    const monthFirstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthLastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    //console.log(monthFirstDay);
    // console.log(monthLastDay);

    // 取得所有計畫dateRange有到達當月任一日期
    // 計畫在每個月可能不只一個
    plansRef
      .where("start_date", ">=", monthFirstDay)
      .where("start_date", "<=", monthLastDay)
      .onSnapshot((snapshot) =>
        setPlans(
          snapshot.docs.map((doc) => Object.assign({ id: doc.id }, doc.data()))
        )
      );
  };

  useEffect(() => {
    // 在當月有找到符合區間的計劃才計算
    if (!plans) return;
    //取得 計畫開始與結束的秒數 (from 1970 (unix))
    setPlansDateRange(
      plans.map((plan) => [
        // ...plansDateRange,
        {
          start: plan?.start_date.seconds * 1000,
          end: plan?.end_date.seconds * 1000,
        },
      ])
    );
  }, [plans]);

  return (
    <div className="calendarPage">
      {plansDateRange && plans ? (
        <>
          <Calendar
            className="calendarPage__calendar"
            onChange={onDateChange}
            showDoubleView={JSON.parse(showDoubleView)}
            showWeekNumbers={JSON.parse(showWeekNumbers)}
            value={date}
            //nextLabel={<ArrowRightIcon onClick={() => onClickLabel("next")} />}
            nextLabel={<ArrowRightIcon />}
            next2Label={null}
            //prevLabel={<ArrowLeftIcon onClick={() => onClickLabel("prev")} />}
            prevLabel={<ArrowLeftIcon />}
            prev2Label={null}
            // showNavigation={false}
            // onClickMonth={getThisMonthPlans}
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
          <div className="calendarPage__functionsContainer">
            <div className="calendarPage__rightFunctionsContainer">
              <IconButton
                color={plansListOpen ? "primary" : "default"}
                onClick={() => setPlansListOpen(plansListOpen ? false : true)}
              >
                <EventNoteIcon className="icon icon-active " />
              </IconButton>

              <IconButton
                color={settingListOpen ? "primary" : "default"}
                onClick={() =>
                  setSettingListOpen(settingListOpen ? false : true)
                }
              >
                <SettingsIcon className="icon" />
              </IconButton>
            </div>
          </div>
          {plansListOpen && (
            <ListOfPlans plans={plans} backgroundColor={"#fefefe"} />
          )}

          {settingListOpen && (
            <div>
              <SettingItem name="showDoubleView" />
              <SettingItem name="showWeekNumbers" />
            </div>
          )}

          <div className="caloriesCalculator">
            <h3>{moment(date).format("L")} surplus calories</h3>
            <div className="caloriesCalculator__container">
              <div>
                {planTDEE[0] ? planTDEE[0] : parseInt(TDEE)} <p>target</p>
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
        </>
      ) : (
        <LoadingPage />
      )}
    </div>
  );
};

export default CalendarPage;
