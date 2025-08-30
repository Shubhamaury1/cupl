import React, { useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";
import { clearCart } from "../redux/slices/CartSlice";
import { useDispatch } from "react-redux";
function Success() {
  const [loading, setLoading] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      dispatch(clearCart());
    }, 2000);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      {loading ? (
        <PropagateLoader color="#36d7b7" />
      ) : (
        <div className="text-green-600">
          <h2 className="text-3xl font-semibold mb-4 text-center">
            Order Successful !
          </h2>
          <p>Your Order has been successfully placed</p>
          
        </div>
      )}
    </div>
  );
}

export default Success;
