import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import ItemCart from "./ItemCart";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
function Cart() {
  const [activeCart, setActiveCart] = useState(false);
  const cartItems = useSelector((state) => state.cart.cart);
  const navigate = useNavigate();
  const totalQty = cartItems.reduce(
    (totalQty, item) => totalQty + item.PQunatity,
    0
  );
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.PQunatity * item.price,
    0
  );

  // Check login status
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  useEffect(() => {
    if (activeCart && !isLoggedIn) {
      navigate("/loginenewpage");
    }
  }, [activeCart, isLoggedIn, navigate]);

  return (
    <>
      <div
        className={`fixed right-0 top-0 bg-white dark:bg-gray-800
        h-full w-full lg:w-[20vw] p-5
      mb-3 ${
        activeCart ? "translate-x-0" : "translate-x-full"
      } transition-all duration-500 z-50`}
      >
        <div className="flex justify-between item-center my-3">
          <span className="text-xl font-bold text-gray-800 dark:text-green-400">
            My Order
          </span>
          <IoMdClose
            onClick={() => setActiveCart(!activeCart)}
            className="border-2 border-gray-600 text-gray-600 font-bold p-1 text-2xl rounded-md hover:text-red-300 hover:border-red-300 cursor-pointer dark:text-red-400 "
          />
        </div>

        {cartItems.length > 0 ? (  
          cartItems.map((food,index) => {
            return (
              <ItemCart
                key={food.id || index}
                id={food.id}
                name={food.name}
                price={food.price}
                img={food.img}
                PQunatity={food.PQunatity}
              />
            );
          })
        ) : (
          <h2 className="text-center text-xl font-bold text-gray-800 mt-10 shadow-md rounded-xl p-2 shadow-green-500 dark:text-green-400">
            Your Cart is Empty!
          </h2>
        )}

        <div className="absolute bottom-0 ">
          <h3 className="mb-2 font-semibold text-gray-800 dark:text-green-400">
            Items : {totalQty}
          </h3>
          <h3 className="mb-2 font-semibold text-gray-800 dark:text-green-400">
            Total Amount : {totalPrice}
          </h3>
          <hr />
          {/* <button
            onClick={() => navigate("/success")}
            className="bg-green-500 font-bold px-3 text-white py-2 rounded-lg w-[90vw] lg:w-[18vw] mt-5 mb-10 dark:shadow-green-500 shadow-md dark:bg-gray-800 dark:text-green-400"
          >
            Checkout
          </button> */}

          <button
            //onClick={() => navigate("/address")}
            onClick={() => {
              if (cartItems.length === 0) {
                toast.error("Cart is Empty!");
                return;
              }
              
              navigate("/address");
            }}
            className="bg-green-500 font-bold px-3 text-white py-2 rounded-lg w-[90vw] lg:w-[18vw] mt-5 mb-10 dark:shadow-green-500 shadow-md dark:bg-gray-800 dark:text-green-400"
          >
            Checkout
          </button>
        </div>
      </div>

      {/* <FaShoppingCart
         onClick={() => setActiveCart(!activeCart)}
        className={`rounded-full bg-white shadow-md text-6xl p-3 fixed bottom-8 right-4 text-gray-900 dark:text-white dark:bg-gray-800 ${
          totalQty > 0 && "animate-bounce delay-500 transition-all duration-500"
        }`}
      /> */}

      <FaShoppingCart
        onClick={() => {
          if (!isLoggedIn) {
            navigate("/loginenewpage");
          } else {
            setActiveCart(!activeCart);
          }
        }}
        className={`rounded-full bg-white shadow-md text-6xl p-3 fixed bottom-8 right-4 text-gray-900 dark:text-white dark:bg-gray-800 ${
          totalQty > 0 && "animate-bounce delay-500 transition-all duration-500"
          }`}
        
      />
    </>
  );
}

export default Cart;
