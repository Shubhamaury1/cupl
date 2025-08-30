import React from "react";
import { FaStar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/CartSlice";

function FoodCard({ id, name, price, desc, img, rating, handleToast }) {
  const dispatch = useDispatch();

  return (
    <>
      <div className="font-bold w-[250px] bg-white p-5 flex flex-col rounded-lg gap-2 text-gray-900 dark:bg-orange-200">
        <img
          src={img}
          alt=""
          className="w-auto h-[130px] hover:scale-110 cursor-grab rounded-lg tranistion-all duration-500 ease-in-out "
        />
        <div className="text-sm flex justify-between">
          <h2>{name}</h2>
          <span className="text-green-500">₹{price}</span>
        </div>
        <p className="text-sm font-normal">{desc}</p>
        <div className="flex justify-between">
          <span className="flex justify-center items-center">
            <FaStar className="mr-1 text-yellow-500 dark:text-orange-500" />
            {rating}
          </span>
          <button
            onClick={() => {
              dispatch(addToCart({ id, name, price, rating, img, qty: 1 }));
              handleToast(name);
            }}
            className="p-1 text-white bg-green-500 hover:bg-green-700 rounded-lg ext-sm "
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}

export default FoodCard;
