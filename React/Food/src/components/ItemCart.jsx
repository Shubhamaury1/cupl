import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";

const APP_URL = import.meta.env.VITE_LOCAL_URL;
const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;
import {
  removeFromCart,
  incrementQty,
  decrementQty,
} from "../redux/slices/CartSlice";

function ItemCart({ id, name, price, img, PQunatity }) {
  const dispatch = useDispatch();
  const [productQuantity, setProductQuantity] = useState(PQunatity);
  const [totalProductQuantity, setTotalProductQuantity] = useState(0);

  useEffect(() => {
    const fetchProductQuantity = async () => {
      try {
        const response = await axios.get(`${APP_URL}/Products/${id}`);
        if (response.status === 200) {
          setTotalProductQuantity(response.data.totalProductQuantity);
        } else {
          toast.error("Error fetching product data.");
        }
      } catch (error) {
        console.error("Error during the API call:", error);
        toast.error("Something went wrong while fetching product data.");
      }
    };
    fetchProductQuantity();
  }, [id]);

  const DeleteToCartItem = async () => {
    const cartItem = { id, name, price, img, PQunatity: productQuantity };
    try {
      const response = await axios.delete(`${APP_URL}/Carts/${id}`);
      if (response.status === 200) {
        dispatch(removeFromCart(cartItem));
        toast(`${name} removed from your cart`, { icon: "👋" });
      } else {
        toast.error("Error removing item from cart.");
      }
    } catch (error) {
      console.error("Error during the API call:", error);
      toast.error("Something went wrong while removing the item.");
    }
  };

  const handleIncrement = async () => {
    if (productQuantity >= totalProductQuantity) {
      toast.error("Cannot add more items than available in stock.");
      return;
    }
    try {
      const response = await axios.put(
        `${APP_URL}/Carts/${id},${productQuantity + 1}`
      );
      if (response.status === 200) {
        setProductQuantity(productQuantity + 1);
        dispatch(
          incrementQty({
            id,
            name,
            price,
            img,
            PQunatity: productQuantity + 1,
          })
        );
        toast.success(`${name} updated in cart`);
      } else {
        toast.error("Error occurred while updating the cart");
      }
    } catch (error) {
      console.error("Error during the API call:", error);
      toast.error("Something went wrong while updating the item.");
    }
  };

  const handleDecrement = async () => {
    if (productQuantity <= 1) {
      return;
    }
    try {
      const response = await axios.put(
        `${APP_URL}/Carts/${id},${productQuantity - 1}`
      );
      if (response.status === 200) {
        setProductQuantity(productQuantity - 1);
        dispatch(
          decrementQty({
            id,
            name,
            price,
            img,
            PQunatity: productQuantity - 1,
          })
        );
        toast.success(`${name} updated in cart`);
      } else {
        toast.error("Error occurred while updating the cart");
      }
    } catch (error) {
      console.error("Error during the API call:", error);
      toast.error("Something went wrong while updating the item.");
    }
  };

  return (
    <>
      <div className="flex gap-2 shadow-md rounded-lg p-2 mb-3 dark:shadow-green-500">
        <MdDelete
          onClick={DeleteToCartItem}
          className="absolute right-7 text-gray-600 cursor-pointer dark:text-red-500"
        />
        <img
          //src={` ${IMG_BASE_URL}` + img}
          src={img}
          alt=""
          className="w-[50px] h-[50px]"
        />
        <div className="leaing-5 ">
          <h2 className="font-bold text-gray-800 dark:text-green-400">
            {name}
          </h2>
          <div className="flex justify-between">
            <span className="text-green-500 font-bold ">₹{price}</span>
            <div className="flex justify-center item-center gap-2 absolute right-7">
              <FaMinus
                onClick={handleDecrement}
                className={`border-2 border-gray-600 text-gray-600 ${
                  productQuantity <= 1 ? "cursor-not-allowed opacity-50" : ""
                } hover:text-white hover:bg-green-500 hover:border-none rounded-md p-1 text-xl transition-all ease-linear`}
              />
              <span className="dark:text-green-500 text-gray-900">
                {productQuantity}
              </span>
              <FaPlus
                onClick={handleIncrement}
                className={`border-2 border-gray-600 text-gray-600 ${
                  productQuantity >= totalProductQuantity
                    ? "cursor-not-allowed opacity-50"
                    : ""
                } hover:text-white hover:bg-green-500 hover:border-none rounded-md p-1 text-xl transition-all ease-linear`}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ItemCart;

