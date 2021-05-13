import React from "react";
import { Link } from "react-router-dom";
import { actionTypes } from "../../../reducer";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { useStateValue } from "../../../StateProvider";
const PlanItem = ({ data }) => {
  const [{}, dispatch] = useStateValue();
  const sendPlanData = () => {
    // 點擊後將該計畫 uid 傳到 global state
    dispatch({
      type: actionTypes.SET_PLANUID,
      planUID: data.id,
    });
  };
  return (
    <Link to="/planDetail">
      <div className="planItem" onClick={sendPlanData}>
        <p>{data?.plan_name}</p>
        {/* 完成率 */}
        <div className="planItem__rightBox">
          <p>完成率: 80%</p>
          <ArrowForwardIosIcon fontSize="small" />
        </div>
      </div>
    </Link>
  );
};

export default PlanItem;
