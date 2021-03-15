import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Select from "./Select";
const MealPlan = () => {
  const [formData, setFormData] = useState();
  const { register, handleSubmit, errors } = useForm(); // initialize the hook

  const onSubmit = (data) => {
    console.log(data);
    console.log(data.diet);
    setFormData(data);
  };

  useEffect(() => {
    if (!formData) {
      return;
    }
    const options = {
      method: "GET",
      url:
        "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/mealplans/generate",
      params: {
        timeFrame: formData.timeFrame,
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
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [formData]);
  return (
    <div className="mealPlan" style={{ marginTop: "100px" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 一週 or 一天 */}
        <label>規劃時間</label>
        <Select
          name="timeFrame"
          options={["day", "week"]}
          register={register({ required: true })}
        />
        {errors.timeFrame && "請輸入規劃時間"}

        {/* 卡路里限制 */}
        <label>卡路里限制</label>
        <input name="targetCalories" ref={register({ required: true })} />
        {errors.targetCalories && "請輸入卡路里限制"}

        {/* 飲食習慣 */}
        <label>飲食習慣</label>
        <input name="diet" ref={register({ required: true })} />
        {errors.diet && "請輸入飲食習慣"}

        {/* 餐點包含何種食材 */}
        <label>餐點包含何種食材</label>
        <input name="exclude" />
        <input type="submit" />
      </form>
    </div>
  );
};

export default MealPlan;
