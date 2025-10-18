// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import PaymentMethod from "../components/PaymentMethod";
// import { jwtDecode } from "jwt-decode";
// const APP_URL = import.meta.env.VITE_LOCAL_URL;

// function ConfirmOrderPage() {
//   const [address, setAddress] = useState([]); // Address list fetched from API
//   const [selectedAddressIndex, setSelectedAddressIndex] = useState(null); // Index of the selected address
//   const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery"); // Default payment method is COD
  
//   const navigate = useNavigate(); // Hook for navigation

//   // Fetching address data from API
//   useEffect(() => {
//     const fetchAddress = async () => {
//       const token = localStorage.getItem("token");
//       const decode = jwtDecode(token);
//       const userid = decode.userid
//       try {
//         const response = await axios.get(
//           `${APP_URL}/Addresses/${userid}`, {
//             headers:{Authorization: `Bearer ${token}`}
//           }
//         );
//         setAddress(response.data); // Store the fetched address list
//       } catch (error) {
//         console.error("Error fetching address details:", error);
//       }
//     };
//     fetchAddress();
//   }, []);

//   // Handle address selection
//   const handleAddressSelection = (index) => {
//     setSelectedAddressIndex(index);
//   };

//   // Handle payment method selection
//   const handlePaymentMethodChange = (e) => {
//     setPaymentMethod(e.target.value);
//   };

//   // Handle placing the order
//   const handlePlaceOrder = async () => {
//     // Check if an address is selected
//     if (selectedAddressIndex === null) {
//       toast.error("Please select an address before placing the order.");
//       return;
//     }

//     // check COD then order placed
//     if (paymentMethod !== "cashOnDelivery") {
//       toast.error("Please select Cash on Delivery.");
//       return;
//     }

//     // Get the selected address from the array
//     const selectedAddress = address[selectedAddressIndex];
//     //const userid = localStorage.getItem("userid");

//     const token = localStorage.getItem("token");
//     const decode = jwtDecode(token);
//     const userid = decode.userid;
//     // Prepare the order data
//     const newOrder = {
//       uId: userid,
//       addressId: selectedAddress.id,
//       paymentMethod,
//     };

//     // Make API call to place the order
//     try {
//       await axios.post(`${APP_URL}/OrdersControllers`, newOrder);
//       toast.success("Order placed successfully!");
//       navigate("/success"); // Redirect to a success page
//     } catch (error) {
//       console.error("Error during the API call:", error);
//       toast.error("Failed to place order");
//     }
//   };

//   return (
//     <div className="text-gray-600 max-w-4xl mx-auto  p-4 h-screen">
//       <h1 className="text-2xl font-semibold mb-6 dark:text-green-500">
//         Confirm Your Order
//       </h1>

//       {/* Address Selection */}
//       <div className="order-products">
//         <h2 className="text-xl mb-4 dark:text-blue-400">Select Your Address</h2>

//         {/* Displaying address cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {address.length === 0 ? (
//             <p>No addresses available</p>
//           ) : (
//             address.map((addressItem, index) => (
//               <div
//                 key={index}
//                 className={`p-4 border rounded-lg shadow-md dark:bg-orange-200 ${
//                   selectedAddressIndex === index
//                     ? "border-blue-500 bg-blue-50"
//                     : "border-gray-300"
//                 }`}
//               >
//                 {/* Radio Button for Address Selection */}
//                 <div className="flex items-center mb-4">
//                   <input
//                     type="radio"
//                     name="selectAddress"
//                     checked={selectedAddressIndex === index}
//                     onChange={() => handleAddressSelection(index)}
//                     className="mt-1 appearance-none w-4 h-4 rounded-full border border-gray-400 bg-white checked:bg-white checked:border-green checked:ring-2 checked:ring-green cursor-pointer"
//                   />
//                   <span className="text-lg font-medium ml-4 dark:text-blue-600">
//                     Select Address
//                   </span>
//                 </div>

//                 {/* Address Details */}
//                 <div className="text-sm">
//                   <div className="font-medium text-gray-800">
//                     Name: {addressItem.userName}
//                   </div>
//                   <div>Phone: {addressItem.phone}</div>
//                   <div>House: {addressItem.houseNumber}</div>
//                   <div>Landmark: {addressItem.landMark}</div>
//                   <div>Type: {addressItem.addressType}</div>
//                   <div>Pincode: {addressItem.pinCode}</div>
//                   <div>City: {addressItem.city}</div>
//                   <div>Country: {addressItem.region}</div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       <PaymentMethod
//         paymentMethod={paymentMethod}
//         handlePaymentMethodChange={handlePaymentMethodChange}
//       />

//       {/* Confirm Order Button */}
//       <div className="mt-6">
//         <button
//           onClick={handlePlaceOrder}
//           className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:bg-orange-300 dark:hover:bg-orange-400"
//         >
//           Confirm Order
//         </button>
//       </div>

//       {/* Toast Notifications */}
//       <Toaster position="top-center" reverseOrder={false} />
//     </div>
//   );
// }

// export default ConfirmOrderPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import PaymentMethod from "../components/PaymentMethod";
import RazorpayPayment from "../components/RazorpayPayment";

const APP_URL = import.meta.env.VITE_LOCAL_URL;

function ConfirmOrderPage() {
  const [address, setAddress] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddress = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decode = jwtDecode(token);
      const userid = decode.userid;

      try {
        const response = await axios.get(`${APP_URL}/api/Addresses/${userid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddress(response.data);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };
    fetchAddress();
  }, []);

  const handleAddressSelection = (index) => setSelectedAddressIndex(index);
  const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);

  const placeOrder = async (paymentType = "cashOnDelivery") => {
    if (selectedAddressIndex === null) {
      toast.error("Please select an address first.");
      return;
    }

    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    const userid = decode.userid;
    const selectedAddress = address[selectedAddressIndex];

    const newOrder = {
      uId: userid,
      addressId: selectedAddress.id,
      paymentMethod: paymentType,
    };

    try {
      await axios.post(`${APP_URL}/api/OrdersControllers`, newOrder, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order placed successfully!");
      navigate("/success");
    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error("Failed to place order");
    }
  };

  const handleCODOrder = () => {
    if (paymentMethod !== "cashOnDelivery") {
      toast.error("Please select Cash on Delivery.");
      return;
    }
    placeOrder("cashOnDelivery");
  };

  return (
    <div className="text-gray-600 max-w-4xl mx-auto p-4 h-screen">
      <h1 className="text-2xl font-semibold mb-6 dark:text-green-500">
        Confirm Your Order
      </h1>

      {/* Address */}
      <div>
        <h2 className="text-xl mb-4 dark:text-blue-400">Select Your Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {address.length === 0 ? (
            <p>No addresses available</p>
          ) : (
            address.map((addr, index) => (
              <div
                key={index}
                onClick={() => handleAddressSelection(index)}
                className={`p-4 border rounded-lg shadow-md cursor-pointer ${
                  selectedAddressIndex === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <h3 className="font-semibold">{addr.userName}</h3>
                <p>
                  {addr.houseNumber}, {addr.city}
                </p>
                <p>{addr.phone}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Payment */}
      <PaymentMethod
        paymentMethod={paymentMethod}
        handlePaymentMethodChange={handlePaymentMethodChange}
      />

      <div className="mt-6">
        {paymentMethod === "razorpay" ? (
          <RazorpayPayment
            amount={totalPrice || 500}
            onSuccess={() => placeOrder("razorpay")}
          />
        ) : (
          <button
            onClick={handleCODOrder}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Confirm Order (COD)
          </button>
        )}
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default ConfirmOrderPage;
