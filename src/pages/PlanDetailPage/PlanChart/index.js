import moment from "moment";
import React, { useState, useEffect } from "react";
import { Chart } from "react-charts";
import { useAuthState } from "react-firebase-hooks/auth";
import db, { auth } from "../../../firebase";
import { useStateValue } from "../../../StateProvider";

const PlanChart = () => {
  const [userLoggedIn] = useAuthState(auth);
  const [{ planUID }, dispatch] = useStateValue();
  const [data, setData] = useState([]);
  const [caloriesData, setCaloriesData] = useState([]);
  const [AVGCaloriesData, setAVGCaloriesData] = useState([]);
  const [weightData, setWeightData] = useState([]);

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

  //console.log(new Date(data[1]?.date?.seconds * 1000).getDate());
  //console.log(moment(data[1]?.date?.seconds * 1000).format("MMM / YY"));
  const mockData = React.useMemo(
    () => [
      {
        label: "Calories",
        data: caloriesData,
      },
      {
        label: "avg Calories",
        data: AVGCaloriesData,
      },
      {
        label: "weight",
        data: weightData,
      },
    ],
    [caloriesData, AVGCaloriesData, weightData]
  );
  const axes = React.useMemo(
    () => [
      { primary: true, type: "ordinal", position: "bottom" },
      { type: "linear", position: "left" },
      // stacked: true -> 兩線值相加
    ],
    []
  );
  const getSeriesStyle = React.useCallback(
    () => ({
      transition: "all .5s ease",
    }),
    []
  );
  const getDatumStyle = React.useCallback(
    () => ({
      transition: "all .5s ease",
    }),
    []
  );
  return (
    <div className="planChart">
      {data.length !== 0 ? (
        <Chart
          data={mockData}
          axes={axes}
          tooltip
          getSeriesStyle={getSeriesStyle}
          getDatumStyle={getDatumStyle}
          primaryCursor
          secondaryCursor
          // dark
        />
      ) : null}
    </div>
  );
};

export default PlanChart;
