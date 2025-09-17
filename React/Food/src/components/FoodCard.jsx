// import React from "react";
// import { FaStar } from "react-icons/fa";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../redux/slices/CartSlice";
// import axios from "axios";
// function FoodCard({ id, name, price, desc, img, rating, handleToast }) {
//   const dispatch = useDispatch();

//   const handleAddToCart = async () => {
//     const item = { id, name, price, rating, img, qty: 1 };
//     try {
//       dispatch(addToCart(item));
//       await axios.post("https://localhost:7076/api/Carts",cartItem,
//       );
//       handleToast(name);
//     } catch (error) {
//       console.error("Error adding item to cart", error);
//     }
//   };

//   return (
//     <>
//       <div className="font-bold w-[250px] bg-white p-5 flex flex-col rounded-lg gap-2 text-gray-900 dark:bg-orange-200">
//         <img
//           src={img}
//           alt=""
//           className="w-auto h-[130px] hover:scale-110 cursor-grab rounded-lg tranistion-all duration-500 ease-in-out "
//         />
//         <div className="text-sm flex justify-between">
//           <h2>{name}</h2>
//           <span className="text-green-500">₹{price}</span>
//         </div>
//         <p className="text-sm font-normal">{desc}</p>
//         <div className="flex justify-between">
//           <span className="flex justify-center items-center">
//             <FaStar className="mr-1 text-yellow-500 dark:text-orange-500" />
//             {rating}
//           </span>
//           {/* <button
//             onClick={() => {
//               dispatch(addToCart({ id, name, price, rating, img, qty: 1 }));
//               handleToast(name);
//             }}
//             className="p-1 text-white bg-green-500 hover:bg-green-700 rounded-lg ext-sm "
//           >
//             Add to Cart
//           </button> */}
//           <button
//             onClick={handleAddToCart}
//             className="p-1 text-white bg-green-500 hover:bg-green-700 rounded-lg ext-sm"
//           >
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

// export default FoodCard;


import React from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios"; // Import Axios
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/CartSlice"; // Assuming you have Redux set up for cart management

function FoodCard({ id, name, price, desc, img, rating, handleToast, userId }) {
  const dispatch = useDispatch();

  // Function to handle Add to Cart
  const handleAddToCart = async () => {
    const cartItem = {
      PId: id, // Product ID
      UId: userId, // User ID (you can get it from the global state or context)
      PQuantity: 1, // Quantity of the product
    };

    try {
      // Dispatch the action to update Redux state (optional, for local state management)
      dispatch(addToCart(cartItem));

      // Send the POST request to the backend to save the cart item in the database
      const response = await axios.post(
        "https://localhost:7076/api/Carts",
        cartItem
      );

      // Show a success toast notification
      handleToast(name); // This will show the name of the product in the toast message
    } catch (error) {
      console.error("Error adding item to cart:", error);
      // Handle the error (maybe show an error toast)
    }
  };

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
      <p className="text-sm font-normal">{desc}</p>
      <div className="flex justify-between">
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
      </div>
    </div>
  );
}

export default FoodCard;
