import React, { useState, useEffect } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import StarIcon from "@material-ui/icons/Star";
import { Checkbox, IconButton } from "@material-ui/core";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import { useForm } from "react-hook-form";
import { useAuthState } from "react-firebase-hooks/auth";
import db, { auth } from "../../../firebase";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { useStateValue } from "../../../StateProvider";
import { actionTypes } from "../../../reducer";
const CardItem = ({ category, item, id, showFunctions, clickable }) => {
  const [userLoggedIn] = useAuthState(auth);
  //const [like, setLike] = useState(item?.data?.like ? item.data.like : false);
  const [deleteItem, setDeleteItem] = useState(false);
  const [
    { date, totalCalories, sportsTotalCalories },
    dispatch,
  ] = useStateValue(); // 取得所選日期
  const foodRef = db
    .collection("users")
    .doc(userLoggedIn.uid)
    .collection("foods")
    .doc(id);
  const sportRef = db
    .collection("users")
    .doc(userLoggedIn.uid)
    .collection("sports")
    .doc(id);

  const delete_f = () => {
    // setDeleteItem(deleteItem ? false : true);
    if (category === "sport") {
      sportRef
        .delete()
        .then(() => {
          // 刪除資料後要將 totalcalories 減去該刪除食物的卡路里
          dispatch({
            type: actionTypes.SET_SPORTS_TOTAL_CALORIES,
            sportsTotalCalories: sportsTotalCalories - item.data.calories,
          });
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    } else {
      foodRef
        .delete()
        .then(() => {
          // 刪除資料後要將 sports total calories 減去該刪除運動燃燒的卡路里
          dispatch({
            type: actionTypes.SET_TOTAL_CALORIES,
            totalCalories: totalCalories - item.data.calories,
          });
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }
  };

  const like_f = () => {
    console.log(item.data.like);
    const like = item.data.like;

    if (like && category === "sport") {
      sportRef.set({ like: false }, { merge: true });
    } else if (!like && category === "sport") {
      sportRef.set({ like: true }, { merge: true });
    } else if (like) {
      foodRef.set({ like: false }, { merge: true });
    } else if (!like) {
      console.log("not like");
      foodRef.set({ like: true }, { merge: true });
    }

    // setLike(like ? false : true);
  };

  const addItem = () => {
    const userRef = db.collection("users").doc(userLoggedIn.uid);

    if (category === "sport") {
      // 新增運動到 firestore
      console.log('add')
      userRef.collection("sports").add({ ...item.data, time: date });
    } else {
      // 新增食物到 firestore
      userRef.collection("foods").add({ ...item.data, time: date });
    }
  };

  return (
    <form className="foodListItem" onClick={clickable && addItem}>
      <div className="foodListItem__leftContainer">
        {showFunctions && (
          <IconButton onClick={delete_f}>
            <HighlightOffIcon />
          </IconButton>
        )}
        <div>
          <p className="foodListItem__title">{item?.data?.name}</p>

          <p className="foodListItem__brand-unit">
            {item?.data?.brand} {item?.data?.serving}
            {item?.data?.serving_unit}
            {item?.data?.desc}
          </p>
        </div>
      </div>

      <div className="foodListItem__caloriesContainer">
        {parseInt(item?.data?.calories)} cal
        {/* <FormControlLabel className="foodListItem__likeIcon" control={} /> */}
        {showFunctions && (
          <Checkbox
            checked={item?.data?.like}
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            name="checkedH"
            onClick={like_f}
          />
        )}
      </div>
    </form>
  );
};

export default CardItem;
