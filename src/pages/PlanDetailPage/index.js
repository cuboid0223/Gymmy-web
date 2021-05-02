import React from "react";
import PlanChart from "./PlanChart";
//import { Resizable, ResizableBox } from "react-resizable";

const PlanDetailPage = () => {
  return (
    <div className="planDetailPage">
      {/* <ResizableBox
        children={}
        width={200}
        height={200}
        minConstraints={[100, 100]}
        maxConstraints={[500, 500]}
      /> */}
      <PlanChart />
    </div>
  );
};

export default PlanDetailPage;
