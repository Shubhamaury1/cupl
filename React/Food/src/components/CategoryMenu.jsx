import React, { useEffect, useState } from "react";
import FoodData from "../data/FoodData";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../redux/slices/CategorySlice";

function CategoryMenu() {
  const [categories, setCategories] = useState([]);

  const listUniqueCategories = () => {
    const uniqueCategories = [
      ...new Set(FoodData.map((food) => food.category)),
    ];
    setCategories(uniqueCategories);
    console.log(uniqueCategories);
  };

  useEffect(() => {
    listUniqueCategories();
  }, []);

  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.category.category);

  return (
    <>
      <div className="mx-10 ">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Find the best food
        </h3>

        {/* <div className="my-6 flex gap-3 overflow-x-scroll scroll-smooth lg:overflow-x-hidden"> */}
        <div className="my-6 flex flex-col sm:flex-row gap-3 overflow-x-auto sm:overflow-x-hidden scroll-smooth text-gray-900 ">
          <button
            onClick={() => dispatch(setCategory("All"))}
            className={` px-3 py-2 bg-gray-200 font-bold rounded-lg hover:bg-green-500 hover:text-white cursor-pointer dark:bg-orange-400 ${
              selectedCategory === "All" && "bg-green-500 text-white"
            }`}
          >
            All
          </button>

          {categories.map((category, index) => {
            return (
              <button
                onClick={() => dispatch(setCategory(category))}
                key={index}
                className={`px-3 py-2 bg-gray-200 font-bold rounded-lg hover:bg-green-500 hover:text-white cursor-pointer dark:bg-orange-400 ${
                  selectedCategory === category && "bg-green-500 text-white"
                }`}
              >
                {category}
              </button>
            );
          })}

          {/* <button className="px-3 py-2 bg-gray-200 font-bold rounded-lg hover:bg-green-500 hover:text-white cursor-pointer">
            Breakfast
          </button>

          <button className="px-3 py-2 bg-gray-200 font-bold rounded-lg hover:bg-green-500 hover:text-white cursor-pointer">
            Lunch
          </button>

          <button className="px-3 py-2 bg-gray-200 font-bold rounded-lg hover:bg-green-500 hover:text-white cursor-pointer">
            Dinner
          </button>

          <button className="px-3 py-2 bg-gray-200 font-bold rounded-lg hover:bg-green-500 hover:text-white cursor-pointer">
            Snacks
          </button> */}
        </div>
      </div>
    </>
  );
}

export default CategoryMenu;
