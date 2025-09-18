import React from "react";

import { FaPlus, FaMinus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import {
  removeFromCart,
  incrementQty,
  decrementQty,
} from "../redux/slices/CartSlice";

function ItemCart({ id, name, price, img, PQunatity }) {
  const dispatch = useDispatch();
  // const DeleteToCartItem = async () => {
  //   const cartItem = {
  //     id,
  //     name,
  //     price,
  //     img,
  //     PQunatity,
  //   };
  //   try {
  //     const response = await axios.delete(
  //       `https://localhost:7076/api/Carts/${id}`
  //     );
  //     //handleToast(name);
  //     if (response.status === 200) {
  //       dispatch(removeFromCart(cartItem));
  //       toast(`${name} removed from your cart`, {
  //         icon: "👋",
  //       });
  //     } else {
  //       toast.error("Error removing item from cart.");
  //     }
  //   } catch (error) {
  //     console.error("Error during the API call:", error);
  //     toast.error("Something went wrong while removing the item.");
  //   }
  // };


  return (
    <>
      <div className="flex gap-2 shadow-md rounded-lg p-2 mb-3 dark:shadow-green-500">
        <MdDelete
          onClick={() => {
            dispatch(removeFromCart({ id, name, price, img, PQunatity }));
            toast(`${name} removed! your Cart`, {
              icon: "👋",
            });
          }}
          className="absolute right-7 text-gray-600 cursor-pointer dark:text-red-500"
        />
        {/* <MdDelete
          onClick={DeleteToCartItem}
          className="absolute right-7 text-gray-600 cursor-pointer dark:text-red-500"
        /> */}
        <img src={img} alt="" className="w-[50px] h-[50px]" />

        <div className="leaing-5 ">
          <h2 className="font-bold text-gray-800 dark:text-green-400">
            {name}
          </h2>
          <div className="flex justify-between">
            <span className="text-green-500 font-bold ">₹{price}</span>
            <div className="flex justify-center item-center gap-2 absolute right-7">
              <FaMinus
                onClick={() =>
                  PQunatity > 1
                    ? dispatch(decrementQty({ id }))
                    : (PQunatity = 0)
                }
                className="border-2 border-gray-600 text-gray-600 hover:text-white hover:bg-green-500 hover:border-none rounded-md p-1 text-xl transition-all ease-linear cursor-pointer"
              />
              <span className="dark:text-green-500 text-gray-900">
                {Number(PQunatity) || 1}
              </span>
              <FaPlus
                onClick={() => dispatch(incrementQty({ id }))}
                className="border-2 border-gray-600 text-gray-600 hover:text-white hover:bg-green-500 hover:border-none rounded-md p-1 text-xl transition-all ease-linear cursor-pointer "
              />
              {/* <FaPlus
                onClick={handleIncrement}
                className="border-2 border-gray-600 text-gray-600 hover:text-white hover:bg-green-500 hover:border-none rounded-md p-1 text-xl transition-all ease-linear cursor-pointer "
              /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ItemCart;
