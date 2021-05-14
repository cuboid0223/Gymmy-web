import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { Chart } from "react-charts";
import Select from "../../../components/MealPlan/Select";
const PlanChart = ({ data }) => {
  //console.log(new Date(data[1]?.date?.seconds * 1000).getDate());
  //console.log(moment(data[1]?.date?.seconds * 1000).format("MMM / YY"));
  const [xAxesPosition, setXAxesPosition] = useState("bottom");
  const [yAxesPosition, setYAxesPosition] = useState("left");
  const [chartType, setChartType] = useState("line");
  const series = React.useMemo(
    () => ({
      //type: "area",
      type: chartType,
    }),
    [chartType]
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: "ordinal", position: xAxesPosition },
      { type: "linear", position: yAxesPosition },
      // stacked: true -> 兩線值相加
    ],
    [yAxesPosition, xAxesPosition]
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

  const setSettingToDefault = () => {
    setYAxesPosition("left");
    setXAxesPosition("bottom");
    setChartType("line");
  };
  return (
    <div className="planChart">
      {data ? (
        <div className="chart">
          <Chart
            data={data}
            series={series}
            axes={axes}
            tooltip
            getSeriesStyle={getSeriesStyle}
            getDatumStyle={getDatumStyle}
            primaryCursor
            secondaryCursor
            // dark
          />
        </div>
      ) : null}
      <div className="planChart__settingContainer">
        <label>chart type</label>
        <Select
          name="chart_type"
          options={["line", "bar", "area", "bubble"]}
          value={chartType}
          onChange_f={(e) => setChartType(e.target.value)}
          //register={register({ required: true })}
        />

        <label>x-axes position</label>
        <Select
          name="x_axes_position"
          options={["bottom", "top", "left", "right"]}
          value={xAxesPosition}
          onChange_f={(e) => setXAxesPosition(e.target.value)}
          // defaultValue={null}
          //register={register({ required: true })}
        />
        <label>y-axes position</label>
        <Select
          name="y_axes_position"
          options={["left", "top", "bottom", "right"]}
          value={yAxesPosition}
          onChange_f={(e) => setYAxesPosition(e.target.value)}
          // defaultValue={null}
          //register={register({ required: true })}
        />
        <Button onClick={() => setSettingToDefault()}>Default</Button>
      </div>
    </div>
  );
};

export default PlanChart;
