import React, { useState, useEffect } from "react";
import PlanChart from "./PlanChart";
//import { Resizable, ResizableBox } from "react-resizable";

import { useAuthState } from "react-firebase-hooks/auth";
import db, { auth } from "../../firebase";
import { useStateValue } from "../../StateProvider";
import moment from "moment";

const PlanDetailPage = () => {
  // attr below
  // series
  // data
  // axes
  //the two axes can't qual to each other

  const [userLoggedIn] = useAuthState(auth);
  //const [{ planUID }, dispatch] = useStateValue();
  const [data, setData] = useState([]);
  const [caloriesData, setCaloriesData] = useState([]);
  const [AVGCaloriesData, setAVGCaloriesData] = useState([]);
  const [weightData, setWeightData] = useState([]);

  
  let planUID = "C3cub3Jc5iPzRk9OtMfU";

  useEffect(() => {
    if (!planUID) return;
    const planRef = db
      .collection("users")
      .doc(userLoggedIn?.uid)
      .collection("plans")
      .doc(planUID)
      .collection("dates");
    planRef
      .orderBy("date")
      .onSnapshot((snapshot) =>
        setData(
          snapshot.docs.map((doc) => Object.assign({ id: doc.id }, doc.data()))
        )
      );
  }, [planUID]);

  useEffect(() => {
    if (!data) return;
    console.log("data: ", data);

    setCaloriesData(
      data.map((doc) => ({
        x:
          (new Date(doc.date.seconds * 1000).getMonth() + 1).toString() +
          "/" +
          new Date(doc.date.seconds * 1000).getDate(),
        y: doc.today_calories,
      }))
    );
    setAVGCaloriesData(
      data.map((doc) => ({
        x:
          (new Date(doc.date.seconds * 1000).getMonth() + 1).toString() +
          "/" +
          new Date(doc.date.seconds * 1000).getDate(),
        y: doc.avg_calories,
      }))
    );
    setWeightData(
      data.map((doc) => ({
        x:
          (new Date(doc.date.seconds * 1000).getMonth() + 1).toString() +
          "/" +
          new Date(doc.date.seconds * 1000).getDate(),
        y: doc.current_weight,
      }))
    );
  }, [data]);

  const mergeData = React.useMemo(
    () => [
      {
        label: "Calories",
        data: caloriesData,
      },
      {
        label: "avg Calories",
        data: AVGCaloriesData,
      },
    ],
    [caloriesData, AVGCaloriesData]
  );

  const weightChartData = React.useMemo(
    () => [
      {
        label: "weight",
        data: weightData,
      },
    ],
    [weightData]
  );
  return (
    <div className="planDetailPage">
      {/* <ResizableBox
        children={}
        width={200}
        height={200}
        minConstraints={[100, 100]}
        maxConstraints={[500, 500]}
      /> */}
      <PlanChart
        data={mergeData}
        chartType
       
      />
      <PlanChart
        data={weightChartData}
        chartType
       
      />

      
    </div>
  );
};

export default PlanDetailPage;
