import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

import ItemCart from "./ItemCart";
import { setCart } from "../redux/slices/CartSlice";

function Cart() {
  const [activeCart, setActiveCart] = useState(false);
  const cartItems = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let username = null;
  let isLoggedIn = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.username;
      isLoggedIn = true;
    } catch (error) {
      console.error(error);
    }
  }

  // Load cart initially
  useEffect(() => {
    if (isLoggedIn && username) {
      const storedCart =
        JSON.parse(localStorage.getItem(`cartItems_${username}`)) || [];
      dispatch(setCart(storedCart));
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      dispatch(setCart(guestCart));
    }
  }, [isLoggedIn, username, dispatch]);

  // Keep localStorage in sync on every cart update
  useEffect(() => {
    if (isLoggedIn && username) {
      localStorage.setItem(`cartItems_${username}`, JSON.stringify(cartItems));
    } else {
      localStorage.setItem("guestCart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoggedIn, username]);

  const totalQty = cartItems.reduce((sum, item) => sum + item.PQunatity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.PQunatity * item.price,
    0
  );

  return (
    <>
      <Toaster position="top-center" />
      <div
        className={`fixed right-0 top-0 bg-white dark:bg-gray-800
        h-full w-full lg:w-[20vw] p-5 mb-3 transition-all duration-500 z-50
        ${activeCart ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between item-center my-3">
          <span className="text-xl font-bold text-gray-800 dark:text-green-400">
            My Order
          </span>
          <IoMdClose
            onClick={() => setActiveCart(false)}
            className="border-2 border-gray-600 text-gray-600 font-bold p-1 text-2xl rounded-md hover:text-red-300 hover:border-red-300 cursor-pointer dark:text-red-400 "
          />
        </div>

        {cartItems.length > 0 ? (
          cartItems.map((food, index) => (
            <ItemCart
              key={food.id || index}
              id={food.id}
              name={food.name}
              price={food.price}
              img={food.img}
              PQunatity={food.PQunatity}
            />
          ))
        ) : (
          <h2 className="text-center text-xl font-bold text-gray-800 mt-10 shadow-md rounded-xl p-2 shadow-green-500 dark:text-green-400">
            Your Cart is Empty!
          </h2>
        )}

        <div className="absolute bottom-0">
          <h3 className="mb-2 font-semibold text-gray-800 dark:text-green-400">
            Items: {totalQty}
          </h3>
          <h3 className="mb-2 font-semibold text-gray-800 dark:text-green-400">
            Total Amount: ₹{totalPrice}
          </h3>
          <hr />
          <button
            onClick={() => {
              if (!isLoggedIn) {
                toast.error("Please login to place your order!");
                navigate("/loginenewpage");
                return;
              }
              if (cartItems.length === 0) {
                toast.error("Cart is Empty!");
                return;
              }
              navigate("/confirmorderpage");
            }}
            className="bg-green-500 font-bold px-3 text-white py-2 rounded-lg w-[90vw] lg:w-[18vw] mt-5 mb-10 dark:shadow-green-500 shadow-md dark:bg-gray-800 dark:text-green-400"
          >
            Place Order
          </button>
        </div>
      </div>

      {!activeCart && (
        <div className="fixed top-11 right-4 z-50">
          <div className="relative">
            <FaShoppingCart
              onClick={() => {
                if (!isLoggedIn) {
                  navigate("/loginenewpage");
                } else {
                  setActiveCart(true);
                }
              }}
              className={`rounded-full bg-white shadow-md text-6xl p-3 text-gray-900 dark:text-white dark:bg-gray-800 cursor-pointer ${
                totalQty > 0 &&
                "animate-bounce delay-500 transition-all duration-500"
              }`}
            />
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                {totalQty}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
