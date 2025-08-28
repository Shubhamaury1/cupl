import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import ItemCart from "./ItemCart";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Cart() {
  const [activeCart, setActiveCart] = useState(false);

  const cartItems = useSelector((state) => state.cart.cart);

  const totalQty = cartItems.reduce((totalQty, item) => totalQty + item.qty, 0);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );

  const navigate = useNavigate();

  return (
    <>
      <div
        className={`fixed right-0 top-0 bg-white
        h-full w-full lg:w-[20vw] p-5
      mb-3 ${
        activeCart ? "translate-x-0" : "translate-x-full"
      } transition-all duration-500 z-50`}
      >
        <div className="flex justify-between item-center my-3">
          <span className="text-xl font-bold text-gray-800">My Order</span>
          <IoMdClose
            onClick={() => setActiveCart(!activeCart)}
            className="border-2 border-gray-600 text-gray-600 font-bold p-1 text-xl rounded-md hover:text-red-300 hover:border-red-300 cursor-pointer"
          />
        </div>

        {cartItems.length > 0 ? (
          cartItems.map((food) => {
            return (
              <ItemCart
                key={food.id}
                id={food.id}
                name={food.name}
                price={food.price}
                img={food.img}
                qty={food.qty}
              />
            );
          })
        ) : (
          <h2 className="text-center text-xl font-bold text-gray-800 mt-10 shadow-md rounded-xl p-2 shadow-green-500">
            Your Cart is Empty!
          </h2>
        )}

        <div className="absolute bottom-0">
          <h3 className="mb-2 font-semibold text-gray-800">
            Items : {totalQty}
          </h3>
          <h3 className="mb-2 font-semibold text-gray-800">
            Total Amount : {totalPrice}
          </h3>
          <hr />
          <button onClick={()=>navigate("/success") } className="bg-green-500 font-bold px-3 text-white py-2 rounded-lg w-[90vw] lg:w-[18vw] mt-5 mb-10">
            Checkout
          </button>
        </div>
      </div>
      <FaShoppingCart
        onClick={() => setActiveCart(!activeCart)}
        className={`rounded-full bg-white shadow-md text-6xl p-3 fixed bottom-8 right-4 ${
          totalQty > 0 && "animate-bounce delay-500 transition-all duration-500"
        }`}
      />
    </>
  );
}

export default Cart;
