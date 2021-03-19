import React, { useState } from "react";
import { Avatar } from "@material-ui/core";
import Modal from "react-modal";
import ArrowIcon from "../../assets/icons8-arrow-60.png";
const Profile = () => {
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
  return (
    <div className="profile">
      <div className="profile__infoContainer personalBasicInfoContainer">
        <Avatar
          className="profile__avatar"
          src="https://instagram.ftpe3-2.fna.fbcdn.net/v/t51.2885-19/s320x320/75234580_203929417505658_4839272255788664566_n.jpg?tp=1&_nc_ht=instagram.ftpe3-2.fna.fbcdn.net&_nc_ohc=R6v0tSp20SwAX_nj1bE&ccb=7-4&oh=47e5e0e299e52d88656eb05673376aa8&oe=607D9589&_nc_sid=7bff83"
        />
        <div className="profile__userInfo">
          <p>Name: Cuboid</p>
          <p>Account: 0101010101</p>
          <p>Gender: Male</p>
          <p>Age: 21</p>
          <p>Height: 180 cm</p>
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
  );
};

export default Profile;
