

import React, { useEffect, useState } from "react";
import FoodCard from "./FoodCard";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
function FoodItems() {
  const [foods, setFoods] = useState([]);
  const selectedCategory = useSelector((state) => state.category.category);
  const search = useSelector((state) => state.search.search);
 const loggedInUserId = 1;
  useEffect(() => {
    axios
      .get("https://localhost:7076/api/FileUpload/all")
      .then((res) => setFoods(res.data))
      .catch((err) => console.error("Error fetching food items:", err));
  }, []);

  const addhandleToast = (name) => toast.success(`Added ${name} to cart`);

  //Apply both Category and Search filter
  const filteredFoods = foods.filter((food) => {
    const matchCategory =
      selectedCategory === "All" || food.category === selectedCategory;
    const matchSearch = food.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-wrap gap-12 justify-center lg:justify-start mx-10 my-10">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((item) => (
            <FoodCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              desc={item.description}
              rating={item.rating}
              img={item.imageUrl}
              handleToast={addhandleToast}
              userId={loggedInUserId}
            />
          ))
        ) : (
          <p className="text-gray-600 text-lg">No food items found.</p>
        )}
      </div>
    </>
  );
}

export default FoodItems;
