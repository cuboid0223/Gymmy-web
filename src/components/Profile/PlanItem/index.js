import React from "react";

const PlanItem = ({ data }) => {
  
  return (
    <div className="planItem">
      <p>{data.plan_name}</p>
      {/* 完成率 */}
      <p>完成率: 80%</p>
    </div>
  );
};

export default PlanItem;
