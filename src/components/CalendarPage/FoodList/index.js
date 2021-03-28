import React, { useState, useEffect } from "react";
import FoodListItem from "../FoodListItem";
import Modal from "react-modal";
import SearchIcon from "@material-ui/icons/Search";
import { useForm } from "react-hook-form";
import { useStateValue } from "../../../StateProvider";
import axios from "axios";
import db from "../../../firebase";
import firebase from "firebase";
import "../../../api/fatSecret";

const FoodList = ({ type }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [searchFoodName, setSearchFoodName] = useState("");
  const [inputFoodName, setInputFoodName] = useState("");
  const { register, handleSubmit, errors } = useForm(); // initialize the hook
  const [{ date }, dispatch] = useStateValue(); // 取得所選日期
  const token = window.localStorage.getItem("token");
  Modal.setAppElement(document.getElementById("root"));
  const customStyles = {
    content: {
      width: "90%",
      height: 400,
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  useEffect(() => {
    const config = {
      url:
        "https://blooming-stream-76058.herokuapp.com/https://platform.fatsecret.com/rest/server.api", // 只有此為必需
      method: "post", 
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },

      params: { method: "food.get.v2", food_id: "33691", format: "json" },
    };
    // axios(config).then((res) => console.log(res.data));
  }, []);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const searchFood = (e) => {
    e.preventDefault();

    closeModal(false);
  };

  const addFood = (data) => {
    // e.preventDefault();

    const newData = Object.assign({ createdTime: date, type: type }, data);
    console.log(newData);
    db.collection("foods").add(newData);
    // 運動
    // db.collection("sports").add()

    // close modal
    setIsOpen(false);
    // submit 完 清空 <input> 裡的值
  };
  return (
    <div className="foodList">
      <div className="foodList__topContainer">
        <p className="foodList__type">{type}</p>
        <p className="foodList__totalCalories">1107 cal</p>
      </div>

      {/* list.map */}
      <FoodListItem />

      <button
        className="foodList__addFoodButton"
        onClick={() => setIsOpen(true)}
      >
        Add Food
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Food Modal"
      >
        {/* modal search form */}
        <div className="foodList__ModalContainer">
          {/* search food form */}
          <form className="foodList__searchFoodForm" action="">
            {/* I need api to get food nutrition */}
            <input
              className="foodList__input"
              type="text"
              placeholder="Search Food Calories"
              value={searchFoodName}
              onChange={setSearchFoodName}
            />
            <SearchIcon onClick={searchFood} />
          </form>

          {/* add custom food tag  */}
          <button className="openAddCustomFoodFormButton btn">open</button>
          <form onSubmit={handleSubmit(addFood)}>
            <input
              className="foodList__input"
              type="text"
              placeholder="enter food name"
              name="title"
              ref={register({ required: true })}
            />
            {errors.title && "title is required."}
            <input
              className="foodList__input"
              type="text"
              placeholder="enter calories"
              name="calories"
              ref={register({ required: true })}
            />
            {errors.calories && "calories is required."}
            <input
              className="foodList__input"
              type="text"
              placeholder="enter food brand"
              name="foodBrand"
              ref={register({ required: true })}
            />
            <input
              className="foodList__input"
              type="text"
              placeholder="enter food serving"
              name="foodServing"
              ref={register({ required: true, pattern: /^[0-9]*$/ })}
            />
            {errors.foodServing && "serving is a number."}
            <input
              className="foodList__input"
              type="text"
              placeholder="enter food serving unit"
              name="unit"
              ref={register({ required: true })}
            />
            {errors.unit && "Unit is required."}

            <input type="submit" value="submit" className="btn" />
          </form>

          <p>歷程</p>
          {/* a list that user has set the foods */}
          <FoodListItem />
        </div>
      </Modal>
    </div>
  );
};

export default FoodList;
