import React, { useState, useEffect } from "react";
import { useStateValue } from "../../StateProvider";
import { Avatar } from "@material-ui/core";
import Modal from "react-modal";
import ArrowIcon from "../../assets/icons8-arrow-60.png";
import PleaseLoginPage from "../Auth/PleaseLoginPage";
import moment from "moment";
import axios from "axios";

const Profile = () => {
  const [{ userInfo }, dispatch] = useStateValue();
  const [BMIData, setBMIData] = useState(null);
  const storage = window.localStorage;
  // const userData = user?.providerData[0];
  // console.log(user);
  const [modalIsOpen, setIsOpen] = useState(false);

  // console.log("localUser: ", JSON.stringify(newUser?.uid));

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

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const secondsToAge = (seconds) => {
    const year_birth = new Date(seconds * 1000).getFullYear();
    const year_now = new Date().getFullYear();
    // console.log(year_now); // now year
    // console.log(year_birth); // 2001
    return parseInt(year_now - year_birth);
  };

  useEffect(() => {
    if (!userInfo) {
      return;
    }

    const BMIOptions = {
      method: "GET",
      url: "https://fitness-calculator.p.rapidapi.com/bmi",
      params: {
        age: secondsToAge(userInfo?.birth?.seconds),
        weight: userInfo?.weight,
        height: userInfo?.height,
      },
      headers: {
        "x-rapidapi-key": "561ee6d36amshf73fd6455efaa12p1935aejsn0c7dc81a59b2",
        "x-rapidapi-host": "fitness-calculator.p.rapidapi.com",
      },
    };

    axios
      .request(BMIOptions)
      .then(function (response) {
        // console.log(response.data);
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
          <Avatar className="profile__avatar" src={userInfo?.imageURL} />
          <div className="profile__userInfo">
            <p>Name: {userInfo?.name}</p>
            <p>Account: {userInfo?.email}</p>
            <p>Gender: {userInfo?.gender}</p>
            {/* 982857600 */}
            {/* <p>{secondsFormats(user?.birth?.seconds)}</p> */}
            <p>Age: {secondsToAge(userInfo?.birth?.seconds)}</p>
            <p>
              Height: {userInfo?.height} {userInfo?.height_unit}
            </p>
            <p>
              Weight: {userInfo?.weight} {userInfo?.weight_unit}
            </p>
            <button onClick={openModal}>open</button>
          </div>
          {/* a modal form to edit userInfo */}
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <form action="">
              <input type="text" placeholder="Name" />
              <input type="text" placeholder="Gender" />
              <input type="text" placeholder="Age" />
              <input type="text" placeholder="Height" />
              <input type="text" placeholder="weight" />
              <input type="submit" value="submit" />
            </form>
            <button onClick={closeModal}>close</button>
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
