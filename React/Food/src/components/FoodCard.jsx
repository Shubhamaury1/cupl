import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/CartSlice";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const APP_URL = import.meta.env.VITE_LOCAL_URL;
const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;

function FoodCard({ id, name, price, img, rating, desc, stock, isBestSeller }) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  let userid = null;

  if (token && typeof token === "string") {
    try {
      const decode = jwtDecode(token);
      userid = decode.userid;
    } catch (error) {
      console.error("Error decoding token:", error);
      toast.error("Invalid or expired token.");
    }
  }

  const [showMore, setShowMore] = useState(false);
  const [productQuantity, setProductQuantity] = useState(0);
  const [totalProductQuantity, setTotalProductQuantity] = useState(stock || 0);

  // Fetch live stock count from API
  useEffect(() => {
    const fetchTotalProductQuantity = async () => {
      try {
        const response = await axios.get(`${APP_URL}/Products/${id}`);
        if (response.status === 200) {
          setTotalProductQuantity(response.data.totalProductQuantity);
        } else {
          toast.error("Error fetching product data.");
        }
      } catch (error) {
        console.error("Error during API call:", error);
        toast.error("Something went wrong while fetching product data.");
      }
    };
    fetchTotalProductQuantity();
  }, [id]);

  // Add to Cart handler
  const handleAddToCart = async () => {
    if (totalProductQuantity === 0) {
      toast.error("Item is Out of Stock.");
      return;
    }

    if (productQuantity >= totalProductQuantity) {
      toast.error("Item is Out of Stock.");
      return;
    }

    const cartItem = {
      id,
      PId: id,
      name,
      price,
      img,
      rating,
      UId: userid,
      PQunatity: 1,
    };

    try {
      dispatch(addToCart(cartItem));
      await axios.post(`${APP_URL}/Carts`, cartItem);
      setProductQuantity(productQuantity + 1);
      toast.success(`${name} has been added to the cart`);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Item is Out Of Stock.");
    }
  };

  // Dynamic stock messages
  const isOutOfStock = totalProductQuantity === 0;
  const isLowStock = totalProductQuantity > 0 && totalProductQuantity <= 3;
  const shortDesc = desc?.length > 21 ? desc.slice(0, 21) + "..." : desc;

  return (
    <div className="relative font-bold w-[250px] bg-white p-5 flex flex-col rounded-lg gap-2 text-gray-900 dark:bg-orange-200">
      <img
        // src={`${IMG_BASE_URL}` + img}
        src={img}
        alt={name}
        className="w-auto h-[130px] hover:scale-110 cursor-grab rounded-lg transition-all duration-500 ease-in-out"
      />

      {isBestSeller && (
        <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-semibold px-2 py-1 rounded shadow">
          Best Seller
        </span>
      )}

      <div className="text-sm flex justify-between">
        <h2>{name}</h2>
        <span className="text-green-500">₹{price}</span>
      </div>

      <div>
        <p className="text-sm font-normal">{showMore ? desc : shortDesc}</p>
        {desc?.length > 21 && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-blue-500 text-xs font-semibold hover:underline"
          >
            {showMore ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      {isLowStock && (
        <p className="text-red-500 text-xs font-semibold">
          Only {totalProductQuantity} item
          {totalProductQuantity > 1 ? "s" : ""} left!
        </p>
      )}

      {isOutOfStock && (
        <p className="text-red-600 text-xs font-semibold">Out of Stock</p>
      )}

      <div className="flex justify-between items-center mt-2">
        <span className="flex justify-center items-center">
          <FaStar className="mr-1 text-yellow-500 dark:text-orange-500" />
          {rating}
        </span>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`p-1 text-white rounded-lg text-sm ${
            isOutOfStock
              ? "bg-red-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-700"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default FoodCard;
