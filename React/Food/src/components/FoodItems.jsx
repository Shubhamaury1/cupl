import React from "react";
import FoodCard from "./FoodCard";
import FoodData from "../data/FoodData.js";
import { useSelector } from "react-redux";

import toast, { Toaster } from "react-hot-toast";

function FoodItems() {
  const category = useSelector((state) => state.category.category);

  const search = useSelector((state) => state.search.search);

  const addhandleToast = (name) => toast.success(`Added ${name} to cart`);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-wrap gap-12 justify-center lg:justify-start mx-10 my-10">
        {FoodData.filter((food) => {
          if (category === "All") {
            return food.name.toLowerCase().includes(search.toLowerCase());
          } else {
            return category === food.category &&
              food.name.toLowerCase().includes(search.toLowerCase());
          }
          //(food.category === category) return food
        }).map((food) => (
          <FoodCard
            key={food.id}
            id={food.id}
            name={food.name}
            price={food.price}
            desc={food.desc}
            rating={food.rating}
            img={food.img}
            handleToast={addhandleToast}
          />
        ))}
      </div>
    </>
  );
}

export default FoodItems;
