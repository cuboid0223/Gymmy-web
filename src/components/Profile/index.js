import React, { useState } from "react";
import { useStateValue } from "../../StateProvider";
import { Avatar } from "@material-ui/core";
import Modal from "react-modal";
import ArrowIcon from "../../assets/icons8-arrow-60.png";
import PleaseLoginPage from "../Auth/PleaseLoginPage";
import moment from "moment";
const Profile = () => {
  const [{ user }, dispatch] = useStateValue();
  // const userData = user?.providerData[0];
  // console.log(user);
  const [modalIsOpen, setIsOpen] = useState(false);
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
    console.log("object");
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
    return year_now - year_birth;
  };
  // console.log(secondsToAge("982857600"));
  return (
    <div className="profile">
      {/* {user ? ( */}
      <div>
        <div className="profile__infoContainer personalBasicInfoContainer">
          <Avatar className="profile__avatar" src={user?.imageURL} />
          <div className="profile__userInfo">
            <p>Name: {user?.name}</p>
            <p>Account: {user?.email}</p>
            <p>Gender: {user?.gender}</p>
            {/* 982857600 */}
            {/* <p>{secondsFormats(user?.birth?.seconds)}</p> */}
            <p>Age: {secondsToAge(user?.birth?.seconds)}</p>
            <p>
              Height: {user?.height} {user?.height_unit}
            </p>
            <p>
              Height: {user?.weight} {user?.weight_unit}
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
            <p>Weight: 60 kg</p>
            <p>BMI: 30</p>
          </div>
          <img src={ArrowIcon} alt="arrow" />
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
