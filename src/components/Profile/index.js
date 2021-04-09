import React, { useState, useEffect } from "react";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../reducer";
import { Avatar } from "@material-ui/core";
import Modal from "react-modal";

import { useHistory } from "react-router-dom";
import PleaseLoginPage from "../Auth/PleaseLoginPage";
import axios from "axios";
import { useForm } from "react-hook-form";
import AlertMessage from "../AlertMessage";
import db, { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Profile = () => {
  const [{ userInfo, user }, dispatch] = useStateValue();
  const [userLoggedIn] = useAuthState(auth);
  console.log(userLoggedIn);
  const [BMIData, setBMIData] = useState(null);
  // const storage = window.localStorage;
  const [modalIsOpen, setIsOpen] = useState(false); // false
  const { register, handleSubmit, watch, errors } = useForm();
  const history = useHistory();

  const onModalFormSubmit = (data) => {
    if (!userInfo) {
      // 如果沒有使用者資料（userInfo），則新增使用者資料（userInfo）
      const newData = Object.assign(
        {
          email: userLoggedIn.email,
          height_unit: "cm",
          weight_unit: "kg",
          user_auth: "normal",
        },
        data
      );
      console.log(newData);
      db.collection("users").doc(userLoggedIn.uid).set(newData);
      history.push("/login");
    } else {
      //如果有使用者資料（userInfo），則更新使用者資料（userInfo）
      db.collection("users").doc(userLoggedIn.uid).update(data);
      setIsOpen(false);
      history.push("/");
    }
  };

  Modal.setAppElement(document.getElementById("root"));
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const isModalOpen = () => {
    setIsOpen(modalIsOpen ? false : true);
    // 修改使用者資料（userInfo）
    if (userInfo) {
      var docRef = db.collection("users").doc(userLoggedIn?.uid);
      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            dispatch({
              type: actionTypes.SET_USERINFO,
              userInfo: doc.data(),
            });
            console.log("user info:", userInfo);
            // storage.setItem("user", JSON.stringify(user));
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            history.push("./profile");
            // sendNotice("go to profile and set your height and weight!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }
  };

  const secondsToAge = (seconds) => {
    const year_birth = new Date(seconds * 1000).getFullYear();
    const year_now = new Date().getFullYear();
    // console.log(year_now); // now year
    // console.log(year_birth); // 2001
    return parseInt(year_now - year_birth);
  };

  useEffect(() => {
    if (!userInfo) {
      setIsOpen(true);
      return;
    }

    const BMIOptions = {
      method: "GET",
      url: "https://fitness-calculator.p.rapidapi.com/bmi",
      params: {
        age: parseInt(userInfo?.age),
        weight: parseInt(userInfo?.weight),
        height: Number(userInfo?.height),
      },
      headers: {
        "x-rapidapi-key": "561ee6d36amshf73fd6455efaa12p1935aejsn0c7dc81a59b2",
        "x-rapidapi-host": "fitness-calculator.p.rapidapi.com",
      },
    }
    axios
      .request(BMIOptions)
      .then(function (response) {
        console.log(response.data);
        setBMIData(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [userInfo]);

  return (
    <div className="profile">
      {/* {user ? ( */}
      <div>
        <div className="profile__infoContainer personalBasicInfoContainer">
          {userLoggedIn.imageURL ? (
            <Avatar className="profile__avatar" src={userLoggedIn?.imageURL} />
          ) : (
            <Avatar className="profile__avatar">{userInfo?.name[0]}</Avatar>
          )}

          <div className="profile__userInfo">
            <p>Name: {userInfo?.name}</p>
            <p>Account: {userLoggedIn?.email}</p>
            <p>Gender: {userInfo?.gender}</p>
            {/* 982857600 */}
            {/* <p>{secondsFormats(user?.birth?.seconds)}</p> */}
            <p>Age: {userInfo?.age}</p>
            <p>
              Height: {userInfo?.height} {userInfo?.height_unit}
            </p>
            <p>
              Weight: {userInfo?.weight} {userInfo?.weight_unit}
            </p>
            <button onClick={isModalOpen}>open</button>
          </div>
          {/* a modal form to edit userInfo */}
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={isModalOpen}
            style={customStyles}
            contentLabel="user info Modal"
          >
            <form onSubmit={handleSubmit(onModalFormSubmit)}>
              <input
                name="name"
                placeholder="Name"
                defaultValue={userInfo?.name}
                ref={register({ required: true })}
              />

              {/* {errors.name && <span> Name is required</span>} */}
              <select
                name="gender"
                ref={register({ required: true })}
                defaultValue={userInfo?.gender}
              >
                <option value="male">male</option>
                <option value="female">female</option>
                <option value="other">other</option>
              </select>
              <input
                name="age"
                type="number"
                placeholder="Age"
                defaultValue={userInfo?.age}
                ref={register({ min: 15, max: 99, required: true })}
              />
              <input
                name="height"
                type="number"
                placeholder="Height"
                defaultValue={userInfo?.height}
                ref={register({ required: true })}
              />
              <input
                name="weight"
                type="number"
                placeholder="weight"
                defaultValue={userInfo?.weight}
                ref={register({ required: true })}
              />
              <input type="submit" value="submit" />
            </form>
            <AlertMessage message={errors?.age?.message} />
            <button onClick={isModalOpen}>close</button>
          </Modal>
        </div>
        <div className="profile__infoContainer">
          {/* current state  */}
          <div className="profile__weightContainer">
            <h3>Current </h3>
            <p>
              Weight: {userInfo?.weight} {userInfo?.weight_unit}
            </p>
            {/* 取到第二位 */}
            <p>BMI:{Math.round(BMIData?.bmi * 100) / 100}</p>
            <p>Health: {BMIData?.health}</p>
            <p>Healthy BMI Range: {BMIData?.healthy_bmi_range}</p>
          </div>
          {/* <img src={ArrowIcon} alt="arrow" /> */}
          {/* ideal state  */}
          <div className="profile__weightContainer">
            <h3>Ideal </h3>
            <p>Weight: 80 kg</p>
            <p>BMI: 30</p>
          </div>
        </div>
        <div className="profile__postsContainer">
          {/* all posts create form user */}
        </div>
      </div>
      {/* ) : (
        <PleaseLoginPage />
      )} */}
    </div>
  );
};

export default Profile;
