import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import SearchIcon from "@material-ui/icons/Search";
import { useForm } from "react-hook-form";
import { useStateValue } from "../../../StateProvider";
import { actionTypes } from "../../../reducer";
import axios from "axios";
import db, { auth } from "../../../firebase";
// import "../../../api/fatSecret";
import { useAuthState } from "react-firebase-hooks/auth";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CloseIcon from "@material-ui/icons/Close";
import CardItemList from "../CardItemList";
import CardItem from "../CardItem";
import moment from "moment";

const Card = ({ type, date, category }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchFoodName, setSearchFoodName] = useState("");
  const [likeItems, setLikeItems] = useState([]);
  const [foods, setFoods] = useState([]);
  const [sports, setSports] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
  const [showFunctions, setShowFunctions] = useState(false);
  const [typeTotalCalories, setTypeTotalCalories] = useState(0);
  const [sportsCalories, setSportsCalories] = useState(0);
  const [whichListNameActive, setWhichListNameActive] = useState("historyList");
  const { register, errors, handleSubmit } = useForm({
    criteriaMode: "all",
  });
  const [{ totalCalories, cardModalOpen }, dispatch] = useStateValue(); // 取得所選日期
  const [userLoggedIn] = useAuthState(auth);
  const userFoodsRef = db
    .collection("users")
    .doc(userLoggedIn.uid) // <- user.uid
    .collection("foods");
  const userSportsRef = db
    .collection("users")
    .doc(userLoggedIn.uid) // <- user.uid
    .collection("sports");
  //console.log(date[0]);
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

  // const token = window.localStorage.getItem("token");
  Modal.setAppElement(document.getElementById("root"));
  const customStyles = {
    content: {
      width: "35%",
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
    // const config = {
    //   url:
    //     "https://blooming-stream-76058.herokuapp.com/https://platform.fatsecret.com/rest/server.api", // 只有此為必需
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + token,
    //   },

    //   params: { method: "food.get.v2", food_id: "33691", format: "json" },
    // };
    // 找尋選定當日的食物
    userFoodsRef
      .where("time", ">=", yesterday)
      .where("time", "<", tomorrow)
      .where("meal_type", "==", type)
      .onSnapshot((snapshot) =>
        setFoods(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })))
      );
    // 找尋選定當日的運動
    userSportsRef
      .where("time", ">=", yesterday)
      .where("time", "<", tomorrow)
      .orderBy("time", "desc")
      .onSnapshot((snapshot) =>
        setSports(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        )
      );
  }, [date]);
  //console.log(likeItems);
  useEffect(() => {
    if (!cardModalOpen) {
      setIsOpen(false);
    } else {
      return;
    }
  }, [cardModalOpen]);

  function openModal() {
    setIsOpen(true);

    // if (category === "sport") {
    //   // 找尋歷程運動
    //   userSportsRef
    //     .where("time", "<", tomorrow)
    //     .orderBy("time", "asc")
    //     .limit(7)
    //     .onSnapshot((snapshot) =>
    //       setHistoryItems(
    //         snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
    //       )
    //     );
    // } else {
    // 找尋歷程食物 and 歷程運動
    (category === "sport" ? userSportsRef : userFoodsRef)
      .where("time", "<", tomorrow)
      .orderBy("time", "asc")
      .limit(7)
      .onSnapshot((snapshot) =>
        setHistoryItems(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        )
      );
    // }
  }

  function closeModal() {
    setIsOpen(false);
  }

  // const searchFood = (e) => {
  //   e.preventDefault();

  //   closeModal(false);
  // };

  // 新增項目到 firestore
  const addItem = (data) => {
    const foodData = Object.assign(
      {
        time: date,
        meal_type: type,
        like: false,
      },
      data
    );
    const sportData = Object.assign(
      {
        time: date,
        like: false,
      },
      data
    );
    if (category === "sport") {
      userSportsRef.add(sportData);
      console.log(sportData);
    } else {
      userFoodsRef.add(foodData);
    }

    // 運動
    // db.collection("sports").add()

    // close modal
    setIsOpen(false);
    // submit 完 清空 <input> 裡的值
  };

  // 取得各餐總卡路里
  useEffect(() => {
    if (!foods) return;
    if (!showFunctions) {
      // 因為按愛心會重新 render foods
      // 所以如果打開 showFunctions 就停止計算 TotalCalories
      var getTotalCalories = 0;
      for (let i = 0; i < foods.length; i++) {
        getTotalCalories += parseInt(foods[i]?.data?.calories);
      }
      // 顯示每一餐的總熱量
      setTypeTotalCalories(getTotalCalories);
      // 為了顯示每一天每一餐加總的總熱量
      if (getTotalCalories !== 0 || totalCalories !== 0) {
        dispatch({
          type: actionTypes.SET_TOTAL_CALORIES,
          totalCalories: totalCalories + getTotalCalories,
        });
      }
    }
  }, [foods]);

  // 取得各運動總卡路里
  useEffect(() => {
    if (!sports) return;
    if (!showFunctions) {
      var getSportsTotalCalories = 0;
      for (let i = 0; i < sports.length; i++) {
        getSportsTotalCalories += parseInt(sports[i]?.data?.calories);
      }
      // 顯示每一項運動當天加總的總熱量
      setSportsCalories(getSportsTotalCalories);
      // 直接傳送 getSportsTotalCalories
      if (getSportsTotalCalories !== 0) {
        dispatch({
          type: actionTypes.SET_SPORTS_TOTAL_CALORIES,
          sportsTotalCalories: getSportsTotalCalories,
        });
      }
    }
  }, [sports]);

  const showMoreFunctions_f = () => {
    // 顯示刪除和愛心按鈕
    setShowFunctions(showFunctions ? false : true);
  };

  const IsAddFormShow = () => {
    setShowAddForm(showAddForm ? false : true);

    setWhichListNameActive("newAddForm");
  };

  const listLikeItems = () => {
    // 點選 like 顯示喜愛食物清單
    const userLikeFoodsRef = db
      .collection("users")
      .doc(userLoggedIn.uid)
      .collection("likeFoods");
    userLikeFoodsRef
      .where("meal_type", "==", type)
      .onSnapshot((snapshot) =>
        setLikeItems(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        )
      );
    setWhichListNameActive("likeList");
  };

  return (
    <div className="card">
      <div className="card__topContainer">
        <p className="card__type">{type}</p>
        <div className="card__topContainer__rightBox">
          <p className="card__totalCalories">
            {category === "sport" ? sportsCalories : typeTotalCalories}cal
          </p>
          {!showFunctions ? (
            <MoreVertIcon onClick={showMoreFunctions_f} />
          ) : (
            <CloseIcon onClick={showMoreFunctions_f} />
          )}
        </div>
      </div>

      {/* list.map */}

      {/* <CardItemList
        items={foods}
        category={category}
        showFunctions={showFunctions}
      /> */}
      {foods?.map((food) => (
        <CardItem
          key={food.id}
          item={food}
          id={food.id}
          showFunctions={showFunctions}
        />
      ))}
      {category === "sport" && (
        <CardItemList
          items={sports}
          category={category}
          showFunctions={showFunctions}
        />
      )}
      <div className="card__bottomContainer">
        <button
          className="card__button card__addFoodButton"
          onClick={openModal}
        >
          Add {type}
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Food Modal"
      >
        <div className="card__ModalContainer">
          {/* search food form */}
          <form className="card__searchFoodForm">
            {/* I need api to get food nutrition */}
            <input
              className="card__input card__searchInput"
              type="text"
              placeholder="Search Food Calories"
              value={searchFoodName}
              onChange={setSearchFoodName}
            />
            <SearchIcon />
          </form>
          {/* modal select list name */}
          <div className="card__listName">
            <p
              className={whichListNameActive === "historyList" ? "active" : ""}
              onClick={() => setWhichListNameActive("historyList")}
            >
              History
            </p>
            <p
              className={whichListNameActive === "likeList" ? "active" : ""}
              onClick={listLikeItems}
            >
              Like
            </p>
            <p className={whichListNameActive === "resultList" ? "active" : ""}>
              Result
            </p>
            <p
              className={whichListNameActive === "newAddForm" ? "active" : ""}
              onClick={IsAddFormShow}
            >
              New
            </p>
          </div>
          {/* add new item form */}
          <form
            className={!showAddForm ? "card__hideAddForm" : ""}
            onSubmit={handleSubmit(addItem)}
          >
            <input
              className="card__input"
              type="text"
              placeholder={`enter ${type} name`}
              name="name"
              ref={register({ required: true })}
            />
            {errors.name && "name is required."}
            <input
              className="card__input"
              type="number"
              placeholder="enter calories"
              name="calories"
              ref={register({ required: true, pattern: /^[0-9]*$/ })}
            />
            {errors.calories && "calories is required."}
            {category === "sport" && (
              <input
                className="card__input"
                type="text"
                placeholder="enter description"
                name="desc"
                ref={register()}
              />
            )}
            {category === "food" && (
              <>
                <input
                  className="card__input"
                  type="text"
                  placeholder="enter food brand"
                  name="brand"
                  ref={register()}
                />
                <input
                  className="card__input"
                  type="number"
                  placeholder="enter food serving"
                  name="serving"
                  ref={register({ required: true, pattern: /^[0-9]*$/ })}
                />
                {errors.serving && "serving is a number."}
                <input
                  className="card__input"
                  type="text"
                  placeholder="enter food serving unit"
                  name="serving_unit"
                  ref={register({ required: true })}
                />
                {errors.serving_unit && "serving_unit is required."}
              </>
            )}

            <input
              type="submit"
              value="Submit"
              className="btn card__submitButton"
            />
          </form>

          {/* a list that user has select the list name */}
          {whichListNameActive === "historyList" && (
            <CardItemList
              items={historyItems}
              category={category}
              type={type}
              clickable
            />
          )}
          {whichListNameActive === "likeList" && (
            <CardItemList
              items={likeItems}
              category={category}
              type={type}
              clickable
              showLikeIcon
            />
          )}

          {/* <CardList items={historyItems} category={category} type={type} /> */}
        </div>
      </Modal>
    </div>
  );
};

export default Card;
