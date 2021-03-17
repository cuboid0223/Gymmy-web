import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Select from "./Select";
// import "../../scss/all.css";
const MealPlan = () => {
  const [formData, setFormData] = useState(null);
  const [translateText, setTranslateText] = useState("");
  const [meals, setMeals] = useState(null);
  const { register, handleSubmit, errors } = useForm(); // initialize the hook

  // meal submit
  const onSubmit = (data) => {
    console.log(data);
    console.log(data.diet);
    setFormData(data);
  };
  // meal request
  useEffect(() => {
    if (!formData) {
      return;
    }

    const options = {
      method: "GET",
      url:
        "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/mealplans/generate",
      params: {
        timeFrame: "day",
        targetCalories: formData.targetCalories,
        diet: formData.diet,
        exclude: formData.exclude,
      },
      headers: {
        "x-rapidapi-key": "561ee6d36amshf73fd6455efaa12p1935aejsn0c7dc81a59b2",
        "x-rapidapi-host":
          "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("meal plan: ", response.data);
        setMeals(response.data);
        setFormData(null);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [formData]);
  // console.log("meals: ", meals);

  useEffect(() => {
    const translatedText = translate(translateText);
    console.log(translatedText);
  }, [translateText]);

  // translate request function
  const translate = (text) => {
    const options = {
      method: "POST",
      url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "accept-encoding": "application/gzip",
        "x-rapidapi-key": "561ee6d36amshf73fd6455efaa12p1935aejsn0c7dc81a59b2",
        "x-rapidapi-host": "google-translate1.p.rapidapi.com",
      },
      data: {
        q: text,
        source: "en",
        target: "zh-TW",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        return response.data;
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  return (
    <div className="mealPlan">
      {/* 有資料回傳 -> meals 則將圖片隱藏 */}
      {!meals && (
        <img
          className="mealPlan__logo"
          src={require("../../assets/gymmy.png")}
          alt="Background"
        />
      )}

      <div className="mealPlan__infoContainer">
        {meals?.meals.map((meal) => (
          <ul className="mealPlan__item" key={meal.id}>
            <li>{meal.title}</li>
            {/* <li>{meal.servings} servings</li> */}
            <a
              className="mealPlan__itemBtn"
              href={meal.sourceUrl}
              target="view_window"
            >
              Recipe
            </a>
          </ul>
        ))}

        {meals && (
          <ul className="mealPlan__nutritionBox">
            <li>
              <p> Calories: </p>
              {meals?.nutrients.calories} g
            </li>
            <li>
              <p>Carbohydrates: </p>
              {meals?.nutrients.carbohydrates} g
            </li>
            <li>
              <p>Fat: </p>
              {meals?.nutrients.fat} g
            </li>
            <li>
              <p>Protein: </p>
              {meals?.nutrients.protein} g
            </li>
          </ul>
        )}
        {/* loader  */}
        {formData && <p>wait...</p>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 一週 or 一天 */}
        {/* <label>規劃時間</label>
        <Select
          name="timeFrame"
          options={["vegetarian", "vegan", "paleo"]}
          register={register({ required: true })}
        />
        {errors.timeFrame && "請輸入規劃時間"} */}

        {/* 卡路里限制 */}
        <label>Target Calories</label>
        <input
          className="input"
          name="targetCalories"
          ref={register({ required: true })}
          placeholder="calories"
        />
        {errors.targetCalories && "please enter targetCalories!"}

        {/* 飲食習慣 */}
        <label>DIET</label>
        <Select
          name="diet"
          options={["none", "vegetarian", "vegan", "paleo diet", "keto diet"]}
          register={register({ required: true })}
        />
        {errors.diet && "請選擇飲食習慣"}

        {/* 餐點包含何種食材 */}
        {/* <label>餐點包含何種食材</label>
        <input name="exclude" /> */}
        <input className="btn mealPlan__btn" type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default MealPlan;
