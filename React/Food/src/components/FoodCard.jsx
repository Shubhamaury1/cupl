import React ,{ useState }from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios"; // Import Axios
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/CartSlice"; // Assuming you have Redux set up for cart management
const APP_URL = import.meta.env.VITE_LOCAL_URL;

function FoodCard({ id, name, price, img, rating, userId,desc, handleToast, stock }) {
  const dispatch = useDispatch();
  const userid=localStorage.getItem("userid")
  const qty = 1;
  // show more options
  const [showMore, setShowMore] = useState(false);

  // Function to handle Add to Cart
  const handleAddToCart = async () => {
    const cartItem = {
      id,
      PId: id,
      name,
      price,
      img,
      rating,
      UId: userid,
      PQunatity: qty,
    };
    try {
      dispatch(addToCart(cartItem));
      await axios.post(`${APP_URL}/Carts`, cartItem);
      handleToast(name);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };
  //stock check
   const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 3;

  //implement show more options
   const shortDesc = desc?.length > 21 ? desc.slice(0, 21) + "..." : desc;

  
  return (
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
      
      {/*describetion show */}
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

      {/* <div className="flex justify-between">
        <span className="flex justify-center items-center">
          <FaStar className="mr-1 text-yellow-500 dark:text-orange-500" />
          {rating}
        </span>
        <button
          onClick={handleAddToCart} // Call the handleAddToCart function when clicked
          className="p-1 text-white bg-green-500 hover:bg-green-700 rounded-lg ext-sm"
        >
          Add to Cart
        </button>
      </div> */}
      {isLowStock && (
        <p className="text-red-500 text-xs font-semibold">
          {/* Only a few items left! */}
          Only {stock} item{stock > 1 ? "s" : ""} left!
        </p>
      )}

      <div className="flex justify-between items-center">
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
