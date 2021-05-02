import React from "react";
import { Link } from "react-router-dom";

import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
const PlanItem = ({ data }) => {
  return (
    <Link to="/planDetail">
      <div className="planItem">
        <p>{data.plan_name}</p>
        {/* 完成率 */}
        <div className="planItem__rightBox">
          <p>完成率: 80%</p>
          <ArrowForwardIosIcon />
        </div>
      </div>
    </Link>
  );
};

export default PlanItem;
