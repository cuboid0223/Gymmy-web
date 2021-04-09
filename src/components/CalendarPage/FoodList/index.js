import React, { useState, useEffect } from "react";
import FoodListItem from "../FoodListItem";
import Modal from "react-modal";
import SearchIcon from "@material-ui/icons/Search";
import { useForm } from "react-hook-form";
import { useStateValue } from "../../../StateProvider";
import { actionTypes } from "../../../reducer";
import axios from "axios";
import db, { auth } from "../../../firebase";
import firebase from "firebase";
import "../../../api/fatSecret";
import moment from "moment";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const FoodList = ({ type, date }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [searchFoodName, setSearchFoodName] = useState("");
  const [foods, setFoods] = useState([]);
  const [typeTotalCalories, setTypeTotalCalories] = useState(0);
  const [inputFoodName, setInputFoodName] = useState("");
  const { register, errors, handleSubmit } = useForm({
    criteriaMode: "all",
  });
  const [{ totalCalories }, dispatch] = useStateValue(); // 取得所選日期
  const [userLoggedIn] = useAuthState(auth);
  const userFoodsRef = db
    .collection("users")
    .doc(userLoggedIn.uid) // <- user.uid
    .collection("foods");
  const yesterday = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0
  );
  const tomorrow = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1,
    0,
    0,
    0
  );
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
    if (!date) return;
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
    // 找尋選定當日的食物
    userFoodsRef
      .where("time", ">=", yesterday)
      .where("time", "<", tomorrow)
      .where("meal_type", "==", type)
      .onSnapshot((snapshot) =>
        setFoods(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })))
      );
  }, [date]);
  // console.log(foods);

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

  // 新增食物到 firestore
  const addFood = (data) => {
    const newData = Object.assign(
      {
        time: date,
        meal_type: type,
      },
      data
    );
    console.log(newData);
    db.collection("users")
      .doc(userLoggedIn.uid)
      .collection("foods")
      .add(newData);
    // 運動
    // db.collection("sports").add()

    // close modal
    setIsOpen(false);
    // submit 完 清空 <input> 裡的值
  };

  // 取得總卡路里
  useEffect(() => {
    if (!foods) return;

    var getTotalCalories = 0;
    for (let i = 0; i < foods.length; i++) {
      getTotalCalories += parseInt(foods[i]?.data?.calories);
    }

    // 顯示每一餐的總熱量
    setTypeTotalCalories(getTotalCalories);
    // 為了顯示每一天每一餐加總的總熱量
    console.log("send");
    dispatch({
      type: actionTypes.SET_TOTAL_CALORIES,
      totalCalories: totalCalories + getTotalCalories,
    });
    //console.log("totalCalories: ", totalCalories);
  }, [foods]);

  return (
    <div className="foodList">
      <div className="foodList__topContainer">
        <p className="foodList__type">{type}</p>
        <p className="foodList__totalCalories">{typeTotalCalories}cal</p>
      </div>

      {/* list.map */}

      {foods?.map((food) => (
        <FoodListItem food={food} key={food.id} />
      ))}
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
              name="name"
              ref={register({ required: true })}
            />
            {errors.name && "name is required."}
            <input
              className="foodList__input"
              type="number"
              placeholder="enter calories"
              name="calories"
              ref={register({ required: true, pattern: /^[0-9]*$/ })}
            />
            {errors.calories && "calories is required."}
            <input
              className="foodList__input"
              type="text"
              placeholder="enter food brand"
              name="brand"
              ref={register()}
            />
            <input
              className="foodList__input"
              type="number"
              placeholder="enter food serving"
              name="serving"
              ref={register({ required: true, pattern: /^[0-9]*$/ })}
            />
            {errors.serving && "serving is a number."}
            <input
              className="foodList__input"
              type="text"
              placeholder="enter food serving unit"
              name="serving_unit"
              ref={register({ required: true })}
            />
            {errors.serving_unit && "serving_unit is required."}

            <input type="submit" value="submit" className="btn" />
          </form>

          <p>歷程</p>
          {/* a list that user has set the foods */}
          {foods?.map((food) => (
            <FoodListItem food={food.data} key={food.id} />
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default FoodList;
