import React, { useState, useEffect } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import StarIcon from "@material-ui/icons/Star";
import { Checkbox } from "@material-ui/core";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import { useForm } from "react-hook-form";
import { useAuthState } from "react-firebase-hooks/auth";
import db, { auth } from "../../../firebase";

const CardItem = ({ food, id, showFunctions }) => {
  const [userLoggedIn] = useAuthState(auth);
  const [like, setLike] = useState(food.data.like ? food.data.like : false);
  const [deleteFood, setDeleteFood] = useState(false);

  const foodRef = db
    .collection("users")
    .doc(userLoggedIn.uid)
    .collection("foods")
    .doc(id);

  const deleteFood_f = () => {
    setDeleteFood(deleteFood ? false : true);
  };

  const likeFood_f = () => {
    if (like) {
      foodRef.set({ like: false }, { merge: true });
    } else {
      foodRef.set({ like: true }, { merge: true });
    }
    setLike(like ? false : true);
  };
  // console.log('like: ',like);

  return (
    <form className="foodListItem">
      <div className="foodListItem__leftContainer">
        {showFunctions && <Checkbox onClick={deleteFood_f} />}

        <div>
          <p className="foodListItem__title">{food?.data?.name}</p>
          <p className="foodListItem__brand-unit">
            {food?.data?.brand} {food?.data?.serving}
            {food?.data?.serving_unit}
          </p>
        </div>
      </div>

      <div className="foodListItem__caloriesContainer">
        {parseInt(food?.data?.calories)} cal
        {/* <FormControlLabel className="foodListItem__likeIcon" control={} /> */}
        {showFunctions && (
          <Checkbox
            checked={like}
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            name="checkedH"
            onClick={likeFood_f}
          />
        )}
      </div>
    </form>
  );
};

export default CardItem;
