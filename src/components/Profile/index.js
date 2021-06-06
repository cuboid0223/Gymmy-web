import React, { useState, useEffect } from "react";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../reducer";
import { Avatar, Button, IconButton } from "@material-ui/core";
import Modal from "react-modal";
import SettingsIcon from "@material-ui/icons/Settings";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import AlertMessage from "../AlertMessage";
import db, { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Select from "../MealPlan/Select";
import PlanModal from "./PlanModal";
import ListOfPlans from "./ListOfPlans";
import AddIcon from "@material-ui/icons/Add";

const Profile = () => {
  const [{ userInfo }, dispatch] = useStateValue();
  const [userLoggedIn] = useAuthState(auth);
  const userRef = db.collection("users").doc(userLoggedIn?.uid);
  const [BMIData, setBMIData] = useState(null);

  // const storage = window.localStorage;
  const [idealWeight, setIdealWeight] = useState(0);
  const [user_BMR, setUser_BMR] = useState(0);
  const [user_TDEE, setUser_TDEE] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false); // false
  const { register, handleSubmit, watch, errors } = useForm();
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [plans, setPlans] = useState([]);

  const plansRef = db
    .collection("users")
    .doc(userLoggedIn?.uid)
    .collection("plans");

  const history = useHistory();
  Modal.setAppElement(document.getElementById("root"));

  useEffect(() => {
    userRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          dispatch({
            type: actionTypes.SET_USERINFO,
            userInfo: doc.data(),
          });

          localStorage.setItem("userInfo", JSON.stringify(doc.data()));
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          setIsOpen(true);
          // history.push("./profile");
          // sendNotice("go to profile and set your height and weight!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

    plansRef.onSnapshot((snapshot) =>
      setPlans(
        snapshot.docs.map((doc) => Object.assign({ id: doc.id }, doc.data()))
      )
    );
  }, [userLoggedIn]);

  useEffect(() => {
    if (!userInfo) return;
    getBMI(userInfo);
    getIdealWeights(userInfo);
    getBMR_and_TDEE(userInfo);
  }, [userInfo]);

  const onModalFormSubmit = (data) => {
    // 如果沒有使用者資料（userInfo），則新增使用者資料（userInfo）
    const newData = Object.assign(
      {
        photoURL: userLoggedIn.photoURL,
        email: userLoggedIn.email,
        height_unit: "cm",
        weight_unit: "kg",
        user_auth: "normal",
      },
      data
    );
    //console.log(newData);
    db.collection("users").doc(userLoggedIn.uid).set(newData, { merge: true });
    setIsOpen(false);
    history.push("/profile");
  };

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

  const isModalOpen = () => setIsOpen(modalIsOpen ? false : true);

  const secondsToAge = (seconds) => {
    const year_birth = new Date(seconds * 1000).getFullYear();
    const year_now = new Date().getFullYear();
    // console.log(year_now); // now year
    // console.log(year_birth); // 2001
    return parseInt(year_now - year_birth);
  };

  const getIdealWeights = (data) => {
    const options = {
      method: "GET",
      url: "https://fitness-calculator.p.rapidapi.com/idealweight",
      params: {
        gender: data?.gender,
        weight: parseInt(data?.weight),
        height: parseInt(data?.height),
      },
      headers: {
        "x-rapidapi-key": "561ee6d36amshf73fd6455efaa12p1935aejsn0c7dc81a59b2",
        "x-rapidapi-host": "fitness-calculator.p.rapidapi.com",
      },
    };
    // console.log(options.params);

    axios
      .request(options)
      .then(function (response) {
        //console.log(response.data);
        setIdealWeight(response.data.Devine);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const getBMI = (data) => {
    const weight = parseInt(data?.weight);
    const height = parseInt(data?.height);
    let bmi = weight / (height / 100) ** 2;
    bmi = Math.round(bmi * 100) / 100;
    let health = "";

    switch (true) {
      case bmi < 18.5:
        health = "體重過輕";
        break;
      case 18.8 <= bmi && bmi < 24:
        health = "正常";
        break;
      case 24 <= bmi && bmi < 27:
        health = "過重";
        break;
      case 27 <= bmi && bmi < 30:
        health = "輕度肥胖";
        break;
      case 30 <= bmi && bmi < 35:
        health = "中度肥胖";
        break;
      case bmi >= 35:
        health = "重度肥胖";
        break;
      default:
        health = "hh";
    }

    setBMIData({ bmi: bmi, health: health });
  };

  const getBMR_and_TDEE = (data) => {
    /*
  Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5. 
  Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161.
    */
    const s = data?.gender === "male" ? 5 : -161;
    // 基礎代謝率
    const BMR = 10 * data?.weight + 6.25 * data?.height - 5 * data?.age + s;
    // 每日總消耗熱量 (TDEE, Total Daily Energy Expenditure)
    let TDEE = 0;
    switch (data?.activity_level) {
      case "久坐":
        TDEE = BMR * 1.2;
        break;
      case "輕量活動":
        TDEE = BMR * 1.375;
        break;
      case "中度活動量":
        TDEE = BMR * 1.55;
        break;
      case "高度活動量":
        TDEE = BMR * 1.725;
        break;
      case "非常高度活動量":
        TDEE = BMR * 1.9;
        break;
      default:
        TDEE = BMR * 1.0;
    }
    setUser_BMR(BMR);
    setUser_TDEE(parseInt(TDEE));
    // dispatch({
    //   type: actionTypes.SET_TARGET_CALORIES,
    //   targetCalories: parseInt(TDEE),
    // });
    localStorage.setItem("TDEE", TDEE);
    localStorage.setItem("BMR", BMR);
  };

  const planModalOpen_f = () => {
    setPlanModalOpen(planModalOpen ? false : true);
  };

  return (
    <div className="profile">
      <IconButton
        className="profile__userInfo__settingButton"
        onClick={isModalOpen}
      >
        <SettingsIcon />
      </IconButton>
      <div>
        <div className="profile__infoContainer personalBasicInfoContainer">
          {userLoggedIn.photoURL ? (
            <Avatar className="profile__avatar" src={userLoggedIn?.photoURL} />
          ) : (
            <Avatar className="profile__avatar">{userInfo?.name[0]}</Avatar>
          )}
          <h2 className="profile__userName">{userInfo?.name}</h2>
          <ul className="profile__userInfo">
            <li>
              <p>
                {userInfo?.height} {userInfo?.height_unit}
              </p>
            </li>
            <li>
              <p>
                {userInfo?.weight} {userInfo?.weight_unit}
              </p>
            </li>
            <li>
              <p>{userInfo?.gender}</p>
            </li>
          </ul>
          {/* a modal form to edit userInfo */}
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={isModalOpen}
            style={customStyles}
            contentLabel="user info Modal"
          >
            <form
              className="profile__modalForm"
              onSubmit={handleSubmit(onModalFormSubmit)}
            >
              <div>
                <label>Name: </label>
                <input
                  name="name"
                  placeholder="Name"
                  defaultValue={userInfo?.name}
                  ref={register({ required: true })}
                />
              </div>

              <div>
                <label>Gender: </label>
                <Select
                  name="gender"
                  options={["male", "female", "other"]}
                  defaultValue={userInfo?.gender}
                  register={register({ required: true })}
                />
              </div>

              <div>
                <label>Age: </label>
                <input
                  name="age"
                  type="number"
                  placeholder="Age"
                  defaultValue={userInfo?.age}
                  ref={register({ max: 80, min: 15, required: true })}
                />
              </div>
              <AlertMessage message={errors?.age?.message} />

              <div>
                <label>Height(cm): </label>
                <input
                  name="height"
                  type="number"
                  placeholder="Height"
                  defaultValue={userInfo?.height}
                  ref={register({ required: true })}
                />
              </div>

              <div>
                <label>Weight(kg): </label>
                <input
                  name="weight"
                  type="number"
                  placeholder="weight"
                  defaultValue={userInfo?.weight}
                  ref={register({ required: true })}
                />
              </div>

              <div>
                <label>Activity Level: </label>
                <Select
                  name="activity_level"
                  //defaultValue={userInfo?.activity_level}
                  options={[
                    "久坐",
                    "輕量活動",
                    "中度活動量",
                    "高度活動量",
                    "非常高度活動量",
                  ]}
                  defaultValue={userInfo?.activity_level}
                  register={register({ required: true })}
                />
              </div>
              <div>
                <button className="btn" type="submit">
                  submit
                </button>
                <button className="btn" onClick={isModalOpen}>
                  cancel
                </button>
              </div>
            </form>
          </Modal>
        </div>

        <div className="profile__infoContainer">
          {/* current state  */}
          <ul className="profile__userInfo">
            <li>
              <span>BMI</span>
              <p>{BMIData?.bmi}</p>
            </li>
            <li>
              <span>activity</span>
              <p>{userInfo?.activity_level}</p>
            </li>
            <li>
              <span>TDEE</span>
              <p>{user_TDEE} cal</p>
            </li>
          </ul>
          {/* ideal state  */}
          {/* <div className="profile__weightContainer">
              <h3>Ideal </h3>
              <p>Weight: {Math.round(idealWeight * 100) / 100} kg</p>
              <p>Healthy BMI Range: {BMIData?.healthy_bmi_range}</p>
            </div> */}
        </div>

        <div className="profile__plansContainer">
          {/* list of user plans */}
          <ListOfPlans plans={plans} />
          {/* a btn to  pop up a modal  */}
          <Button className="profile__planModalBtn" onClick={planModalOpen_f}>
            Start a new plan
          </Button>
          {/* the modal */}
          <PlanModal
            TDEE={user_TDEE}
            planModalOpen={planModalOpen}
            planModalOpen_f={planModalOpen_f}
            userCurrentWeight={userInfo?.weight}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
