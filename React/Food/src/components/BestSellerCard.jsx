import React from "react";
import toast from "react-hot-toast";

function BestSellerCard({ id, name, price, img, rating }) {
  //function handle cart
  const handleAddToCart = async () => {
    toast.success("Select Item in Above or by Name");
  };
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

        <button
          className=" mt-4 p-1 text-white rounded-lg text-sm bg-blue-400 hover:bg-blue-600"
          onClick={handleAddToCart}
        >
          View
        </button>
      </div>
    </>
  );
}

export default BestSellerCard;
