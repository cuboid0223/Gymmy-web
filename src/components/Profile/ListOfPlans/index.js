import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import db, { auth } from "../../../firebase";
import PlanItem from "../PlanItem";

const ListOfPlans = () => {
  const [userLoggedIn] = useAuthState(auth);
  const [plans, setPlans] = useState([]);
  const plansRef = db
    .collection("users")
    .doc(userLoggedIn?.uid)
    .collection("plans");

  useEffect(() => {
    plansRef.onSnapshot((snapshot) =>
      setPlans(
        snapshot.docs.map((doc) => Object.assign({ id: doc.id }, doc.data()))
      )
    );
  }, []);

  console.log(plans);
  return (
    <div className="listOfPlans">
      {plans
        ? plans.map((plan) => <PlanItem key={plan.id} data={plan} />)
        : null}
    </div>
  );
};

export default ListOfPlans;
