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
  const [foods, setFoods] = useState([]);
  const [inputFoodName, setInputFoodName] = useState("");
  const { register, handleSubmit, errors } = useForm(); // initialize the hook
  const [{ date, user }, dispatch] = useStateValue(); // 取得所選日期
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
    if (!date) {
      return;
    }
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
    // console.log("eow ");
    // console.log(user?.uid);

    // date.setDate(date.getDate() - 1) => date 減一天
    const yesterday = date.setDate(date.getDate() - 1) / 1000;
    // date.setDate(date.getDate() + 1) => date 加一天
    const tomorrow = date.setDate(date.getDate() + 1) / 1000;
    console.log("yesterday: ", yesterday);
    const userFoodRef = db
      .collection("users")
      .doc("JCgBwjeIucQyoQU8IdgQ7GUB8642")
      .collection("foods");

    userFoodRef
      // .orderBy("time", "desc")
      // .where("brand", "==", "麥當勞")
      .where("time", ">", yesterday)
      .where("time", "<", tomorrow)
      .onSnapshot((snapshot) =>
        setFoods(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })))
      );
    // db.collection("users")
    //   // .doc(user?.uid)
    //   .doc("JCgBwjeIucQyoQU8IdgQ7GUB8642")
    //   .collection("foods")
    //   .where("brand", "==", "麥當勞")
    //   // .where("time", ">=", yesterday)
    //   // .where("time.seconds", "==", false)
    //   .get()
    //   .then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       console.log(doc.data());
    //       const foodInsertDate = doc.data().time.seconds.valueOf();

    //       // console.log(foodInsertDate);
    //       setFoods([...foods, doc.data()]);
    //       if (yesterday < foodInsertDate < tomorrow) {
    //         // console.log(doc.data());
    //       }
    //       // doc.data() is never undefined for query doc snapshots
    //     });
    //   })
    //   .catch((error) => {
    //     console.log("ss");
    //     console.log("Error getting documents: ", error);
    //   });
  }, [date]);
  console.log(foods);

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
      {!foods && <FoodListItem />}

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
          {foods?.map((food) => (
            <FoodListItem food={food.data} key={food.id} />
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default FoodList;
