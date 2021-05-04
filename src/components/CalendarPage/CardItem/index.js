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
const CardItem = ({
  category,
  item,
  id,
  showFunctions,
  clickable,
  showLikeIcon,
}) => {
  const [userLoggedIn] = useAuthState(auth);
  const [like, setLike] = useState(false);
  const [isLikeFoodExit, setIsLikeFoodExit] = useState(false);
  const [likeFoodId, setLikeFoodId] = useState("");
  const [likeIconClick, setLikeIconClick] = useState(false);
  const [deleteItem, setDeleteItem] = useState(false);
  let { name, brand, serving_unit, serving, desc, calories } = item?.data;
  const [
    { date, totalCalories, sportsTotalCalories, cardModalOpen },
    dispatch,
  ] = useStateValue();
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
  const userLikeFoodsRef = db
    .collection("users")
    .doc(userLoggedIn.uid)
    .collection("likeFoods");

  const delete_f = () => {
    // setDeleteItem(deleteItem ? false : true);
    if (category === "sport") {
      sportRef
        .delete()
        .then(() => {
          // 刪除資料後要將 totalcalories 減去該刪除食物的卡路里
          dispatch({
            type: actionTypes.SET_SPORTS_TOTAL_CALORIES,
            sportsTotalCalories: sportsTotalCalories - calories,
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
            totalCalories: totalCalories - calories,
          });
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }
  };

  const IsDataInLikeList = () => {
    // 先找尋使用者有無曾經將此食物加入到 likeFoods
    const IsLikeFoodExitQuery = userLikeFoodsRef.where("name", "==", name);
    console.log("name: ", name);
    IsLikeFoodExitQuery.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id);
        if (doc.exists) {
          console.log("exist");
          // 方便之後刪除
          setLikeFoodId(doc.id);
          // 有資料  setIsLikeFoodExit(true)
          setIsLikeFoodExit(true);
          // 有資料 代表之前有加入過喜愛清單內，所以在顯示中要將愛心塗紅
          setLike(true);
        } else {
          console.log("not exist");
        }
      });
    });
  };

  const like_f = () => {
    // 新增 likeFoods collection
    // 先找尋使用者有無曾經加入到 likeFoods
    // （喜歡）有資料，則不新增進去
    // （喜歡）沒有資料，則新增進去
    // （不喜歡）有資料，刪除

    setLikeIconClick(likeIconClick ? false : true);
    setLike(like ? false : true);
  };

  useEffect(() => {
    if (!showFunctions) return;
    IsDataInLikeList();
    // 點擊 showFunctions 觸發，是因為要將愛心變紅色
    // likeIconClick 觸發，判斷 該項目有無在  likeList 裡
  }, [likeIconClick, showFunctions, showLikeIcon]);

  useEffect(() => {
    // 有愛心圖案可以點的才觸發此 useEffect
    //if (!showLikeIcon) return;
    IsDataInLikeList();

    console.log("isLikeFoodExit: ", isLikeFoodExit);
    console.log("like: ", like);
    if (!isLikeFoodExit && like) {
      // 如果 喜愛清單中沒有資料且按下喜歡，則新增進去
      userLikeFoodsRef.add(item?.data);
    } else if (isLikeFoodExit && !like) {
      // 如果 喜愛清單中有資料（代表已按愛心）-> 刪除資料，並把愛心取消， setIsLikeFoodExit(false)
      userLikeFoodsRef
        .doc(likeFoodId)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        });
      setLike(false);
      setIsLikeFoodExit(false);
    } else {
      return;
    }
  }, [likeIconClick, showLikeIcon]);

  const addItem = () => {
    const userRef = db.collection("users").doc(userLoggedIn.uid);

    if (category === "sport") {
      // 新增運動到 firestore
      console.log("add");
      userRef.collection("sports").add({ ...item.data, time: date });
    } else {
      // 新增食物到 firestore
      userRef.collection("foods").add({ ...item.data, time: date });
    }
    // 將 Modal 關掉

    dispatch({
      type: actionTypes.SET_CARD_MODAL_OPEN,
      cardModalOpen: false,
    });
  };

  return (
    <form className="foodListItem">
      <div
        className="foodListItem__leftContainer"
        onClick={clickable && addItem}
      >
        {showFunctions && (
          <IconButton onClick={delete_f}>
            <HighlightOffIcon />
          </IconButton>
        )}
        <div>
          <p className="foodListItem__title">{name}</p>

          <p className="foodListItem__brand-unit">
            {brand} {serving}
            {serving_unit}
            {desc}
          </p>
        </div>
      </div>

      <div className="foodListItem__caloriesContainer">
        {parseInt(calories)} cal
        {/* <FormControlLabel className="foodListItem__likeIcon" control={} /> */}
        {showFunctions && (
          <Checkbox
            checked={like}
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            name="checkedH"
            onClick={like_f}
          />
        )}
        {showLikeIcon && (
          <Checkbox
            checked={like}
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
