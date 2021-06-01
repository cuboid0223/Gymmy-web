import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Select from "../../MealPlan/Select";
import Modal from "react-modal";
import { Button, Input } from "@material-ui/core";
import moment from "moment";
import db, { auth } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const PlanModal = ({
  planModalOpen,
  planModalOpen_f,
  TDEE,
  userCurrentWeight,
}) => {
  const { register, handleSubmit, watch, errors, getValues } = useForm();
  const [planName, setPlanName] = useState("");
  const [planTarget, setPlanTarget] = useState("減重");
  const [newTDEE, setNewTDEE] = useState(0);
  const [planDay, setPlanDay] = useState(1);
  const [dayAverageSurplusCalories, setDayAverageSurplusCalories] = useState(0);
  const [planStartDate, setPlanStartDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [planEndDate, setPlanEndDate] = useState(
    moment().add(30, "days").format("YYYY-MM-DD")
  );
  const [targetWeight, setTargetWeight] = useState(0);
  const [totalTargetCalories, setTotalTargetCalories] = useState(0);
  const [userLoggedIn] = useAuthState(auth);
  const planRef = db
    .collection("users")
    .doc(userLoggedIn?.uid)
    .collection("plans");
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "90%",
    },
  };
  useEffect(() => {
    getDailyNeedPlusOrSubtractCalories(
      TDEE,
      userCurrentWeight,
      targetWeight,
      planStartDate,
      planEndDate
    );
  }, [targetWeight, planStartDate, planEndDate, planDay]);

  const getDailyNeedPlusOrSubtractCalories = async (
    userTDEE,
    currentWeight,
    targetWeight,
    startDate,
    endDate
  ) => {
    // 如果是減重
    // if 68 kg -> 66 kg
    // 1kg 7700 cal
    // -7700 * 2 = -15400 cal
    // 兩個月達成
    // -15400 / 61 = -256 cal/per day
    // 每天需攝取 TDEE + (- 256) cal 的卡路里
    //console.log(targetWeight, currentWeight);
    // 達成目標的總卡路里
    const targetTotalNeedCalories = (targetWeight - currentWeight) * 7700;
    setTotalTargetCalories(targetTotalNeedCalories);
    const targetPlanDay = await getPlanDay_f(startDate, endDate);
    // targetTotalNeedCalories / 天數  --> 每日多或少攝取的卡路里
    const dayAverageSurplusCalories = targetTotalNeedCalories / targetPlanDay;
    setDayAverageSurplusCalories(parseInt(dayAverageSurplusCalories));

    setNewTDEE(parseInt(userTDEE + dayAverageSurplusCalories));
    //return TDEE + everyDayNeedCalories;
  };

  const getPlanDay_f = (startDate, endDate) => {
    const day1 = new Date(startDate);
    const day2 = new Date(endDate);

    const planDaySeconds = day2.getTime() - day1.getTime();
    const planDay = planDaySeconds / (1000 * 3600 * 24);
    //console.log(planDay);
    setPlanDay(planDay);
    return planDay;
  };
  const getPlanName = (e) => setPlanName(e.target.value);
  const getPlanTarget_f = (e) => setPlanTarget(e.target.value);

  const getTargetWeight_f = (e) => {
    const weight = e.target.value;
    setTargetWeight(weight);
    // if (weight < userCurrentWeight && planTarget === "增重") {
    //   // send error
    //   console.log("err");
    // } else if (weight > userCurrentWeight && planTarget === "減重") {
    //   // send error
    //   console.log("err");
    // }
  };

  const onModalFormSubmit = () => {
    let startDate = getValues("start_date");
    let endDate = getValues("end_date");
    const data = {
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      total_target_cal: totalTargetCalories,
      plan_name: planName,
      plan_day: planDay,
      plan_target: planTarget,
      target_weight: targetWeight,
      current_weight: userCurrentWeight,
      plan_TDEE: newTDEE,
    };
    console.log(data);
    planRef.add(data, { merge: true });
  };

  return (
    <Modal
      isOpen={planModalOpen}
      onRequestClose={planModalOpen_f}
      style={customStyles}
      contentLabel="user info Modal"
    >
      <form className="planModal" onSubmit={handleSubmit(onModalFormSubmit)}>
        <div>
          <label>Plan Name: </label>
          <input
            name="plan_name"
            value={planName}
            onChange={getPlanName}
            ref={register({
              required: true,
            })}
          />
        </div>
        <Select
          name="plan_target"
          //defaultValue={userInfo?.activity_level}
          options={["減重", "增重"]}
          defaultValue={planTarget}
          register={register({ required: true })}
          onChange_f={getPlanTarget_f}
        />

        {/* if 減脂 */}
        {/* 顯示 目標公斤數 */}
        {(planTarget === "減重" || planTarget === "增重") && (
          <div>
            <label>Target Weight: </label>
            <input
              name="target_weight"
              type="number"
              defaultValue={userCurrentWeight}
              onChange={getTargetWeight_f}
              //name="target_weight"
              ref={register({
                // 如果選減重，則輸入不能大於等於原本體重，小於150kg
                max: planTarget === "減重" ? userCurrentWeight : 150,
                // 如果選增重，則輸入不能小於等於原本體重，大於0kg
                min: planTarget === "增重" ? userCurrentWeight : 0,
                required: true,
              })}
            />
          </div>
        )}

        {/* if 增肌 */}
        {/* 顯示 目標公斤數 */}
        {/* {planTarget === "增重" && (
          <div>
            <label>Target Weight</label> <input type="number" />
          </div>
        )} */}

        {/* if 維持體重 */}
        {/* plan day selector 不需顯示 */}
        {planTarget !== "維持體重" && (
          <div>
            <div>
              <label>Start Date</label>
              <input
                id="date"
                name="start_date"
                type="date"
                value={planStartDate}
                onChange={(e) => setPlanStartDate(e.target.value)}
                ref={register({
                  required: true,
                })}
              />
            </div>
            <div>
              <label>End Date</label>
              <input
                id="date"
                name="end_date"
                type="date"
                value={planEndDate}
                onChange={(e) => setPlanEndDate(e.target.value)}
                ref={register({
                  min: planStartDate,
                  required: true,
                })}
              />
            </div>
          </div>
        )}
        {newTDEE && planTarget !== "維持體重" ? (
          <div>
            <p>TDEE(Before): {TDEE} cal</p>
            <p>Plan Day: {planDay} day</p>
            <p>
              TDEE(After): {TDEE} + {dayAverageSurplusCalories} = {newTDEE} cal
            </p>
          </div>
        ) : null}

        <Button type="submit">Submit</Button>
      </form>
    </Modal>
  );
};

export default PlanModal;
