import React from "react";

import PlanItem from "../PlanItem";

const ListOfPlans = ({ plans, backgroundColor }) => {
  // console.log(plans);
  return (
    <div className="listOfPlans" style={{backgroundColor: backgroundColor}}>
      {plans
        ? plans.map((plan) => <PlanItem key={plan.id} data={plan} />)
        : null}
    </div>
  );
};

export default ListOfPlans;
