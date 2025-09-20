// import React, { useState, useEffect } from "react";
// import axios from "axios";
// function ConfirmOrderPage() {
//   const [address, setAddress] = useState([]);
//   const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);

//   // Fetching address data
//   useEffect(() => {
//     const fetchAddress = async () => {
//       try {
//         const response = await axios.get(
//           "https://localhost:7076/api/Addresses"
//         );
//         setAddress(response.data);
//         //console.log("Addresses fetched: ", response.data);
//       } catch (error) {
//         console.error("Error fetching address details:", error);
//       }
//     };
//     fetchAddress();
//   }, []);

//   const handleAddressSelection = (index) => {
//     setSelectedAddressIndex(index);
//   };

//   return (
//     <div className="text-gray-600 max-w-4xl mx-auto my-8 p-4">
//       <h1 className="text-2xl font-semibold mb-6">Confirm Your Order</h1>

//       {/* Address Selection */}
//       <div className="order-products">
//         <h2 className="text-xl mb-4">Select Your Address</h2>

//         {/* Displaying address cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {address.length === 0 ? (
//             <p>No addresses available</p>
//           ) : (
//             address.map((addressItem, index) => (
//               <div
//                 key={index}
//                 className={`p-4 border rounded-lg shadow-sm ${
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
//                     className="mt-1 appearance-none w-4 h-4 rounded-full border border-gray-400 bg-white checked:bg-white checked:border-green checked:ring-2 checked:ring-green"
//                   />
//                   <span className="text-lg font-medium ml-4">Select Address</span>
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
//     </div>
//   );
// }

// export default ConfirmOrderPage;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";

// function ConfirmOrderPage() {
//   const [address, setAddress] = useState([]);
//     const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
//     const [addressList, setAddressList] = useState([]);
//   const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery"); // Default is COD

//   // Fetching address data
//   useEffect(() => {
//     const fetchAddress = async () => {
//       try {
//         const response = await axios.get(
//           "https://localhost:7076/api/Addresses"
//         );
//         setAddress(response.data);
//         //console.log("Addresses fetched: ", response.data);
//       } catch (error) {
//         console.error("Error fetching address details:", error);
//       }
//     };
//     fetchAddress();
//   }, []);

//   const handleAddressSelection = (index) => {
//     setSelectedAddressIndex(index);
//   };

//   const handlePaymentMethodChange = (e) => {
//     setPaymentMethod(e.target.value);
//   };

//      const handlePlaceOrder = async () => {
//        if (selectedAddressIndex === null) {
//          toast.error("Please select an address");
//          return;
//        }
//        const selectedAddress = addressList[selectedAddressIndex];
//        const newOrder = {
//          uId: 1,
//          addressId: selectedAddress.id,
//        };
//        try {
//          await axios.post(
//            "https://localhost:7076/api/OrdersControllers",
//            newOrder
//          );
//          toast.success("Order placed successfully!");
//          navigate("/success");
//        } catch (error) {
//          console.error("Error during the API call:", error);
//          toast.error("Failed to place order");
//        }
//      };

//   return (
//     <div className="text-gray-600 max-w-4xl mx-auto my-8 p-4">
//       <h1 className="text-2xl font-semibold mb-6">Confirm Your Order</h1>

//       {/* Address Selection */}
//       <div className="order-products">
//         <h2 className="text-xl mb-4">Select Your Address</h2>

//         {/* Displaying address cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {address.length === 0 ? (
//             <p>No addresses available</p>
//           ) : (
//             address.map((addressItem, index) => (
//               <div
//                 key={index}
//                 className={`p-4 border rounded-lg shadow-sm ${
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
//                     className="mt-1 appearance-none w-4 h-4 rounded-full border border-gray-400 bg-white checked:bg-white checked:border-green checked:ring-2 checked:ring-green"
//                   />
//                   <span className="text-lg font-medium ml-4">
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

//       {/* Payment Method Section */}
//       <div className="payment-method mt-6">
//         <h2 className="text-xl mb-4">Select Payment Method</h2>
//         <div className="flex items-center mb-4">
//           <input
//             type="radio"
//             id="cashOnDelivery"
//             name="paymentMethod"
//             value="cashOnDelivery"
//             checked={paymentMethod === "cashOnDelivery"}
//             onChange={handlePaymentMethodChange}
//             className="mr-2"
//           />
//           <label htmlFor="cashOnDelivery" className="text-lg">
//             Cash on Delivery
//           </label>
//         </div>

//         {/* Additional Payment Methods can go here if needed */}
//         {/* Example: Credit Card */}
//         {/* <div className="flex items-center mb-4">
//           <input
//             type="radio"
//             id="creditCard"
//             name="paymentMethod"
//             value="creditCard"
//             checked={paymentMethod === 'creditCard'}
//             onChange={handlePaymentMethodChange}
//             className="mr-2"
//           />
//           <label htmlFor="creditCard" className="text-lg">Credit Card</label>
//         </div> */}
//       </div>

//       {/* Confirm Order Button */}
//       <div className="mt-6">
//         <button
//           onClick={handlePlaceOrder}
//           className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//         >
//           Confirm Order
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ConfirmOrderPage;


import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ConfirmOrderPage() {
  const [address, setAddress] = useState([]); // Address list fetched from API
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null); // Index of the selected address
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery"); // Default payment method is COD

  const navigate = useNavigate(); // Hook for navigation

  // Fetching address data from API
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7076/api/Addresses"
        );
        setAddress(response.data); // Store the fetched address list
      } catch (error) {
        console.error("Error fetching address details:", error);
      }
    };
    fetchAddress();
  }, []);

  // Handle address selection
  const handleAddressSelection = (index) => {
    setSelectedAddressIndex(index);
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Handle placing the order
  const handlePlaceOrder = async () => {
    // Check if an address is selected
    if (selectedAddressIndex === null) {
      toast.error("Please select an address before placing the order.");
      return;
    }

    // Get the selected address from the array
    const selectedAddress = address[selectedAddressIndex];

    // Prepare the order data
    const newOrder = {
      uId: 1, // Replace with actual user ID if needed
      addressId: selectedAddress.id,
      paymentMethod,
    };

    // Make API call to place the order
    try {
      await axios.post(
        "https://localhost:7076/api/OrdersControllers",
        newOrder
      );
      toast.success("Order placed successfully!");
      navigate("/success"); // Redirect to a success page
    } catch (error) {
      console.error("Error during the API call:", error);
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="text-gray-600 max-w-4xl mx-auto my-8 p-4">
      <h1 className="text-2xl font-semibold mb-6">Confirm Your Order</h1>

      {/* Address Selection */}
      <div className="order-products">
        <h2 className="text-xl mb-4">Select Your Address</h2>

        {/* Displaying address cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {address.length === 0 ? (
            <p>No addresses available</p>
          ) : (
            address.map((addressItem, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg shadow-sm ${
                  selectedAddressIndex === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                {/* Radio Button for Address Selection */}
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    name="selectAddress"
                    checked={selectedAddressIndex === index}
                    onChange={() => handleAddressSelection(index)}
                    className="mt-1 appearance-none w-4 h-4 rounded-full border border-gray-400 bg-white checked:bg-white checked:border-green checked:ring-2 checked:ring-green"
                  />
                  <span className="text-lg font-medium ml-4">
                    Select Address
                  </span>
                </div>

                {/* Address Details */}
                <div className="text-sm">
                  <div className="font-medium text-gray-800">
                    Name: {addressItem.userName}
                  </div>
                  <div>Phone: {addressItem.phone}</div>
                  <div>House: {addressItem.houseNumber}</div>
                  <div>Landmark: {addressItem.landMark}</div>
                  <div>Type: {addressItem.addressType}</div>
                  <div>Pincode: {addressItem.pinCode}</div>
                  <div>City: {addressItem.city}</div>
                  <div>Country: {addressItem.region}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Payment Method Section */}
      <div className="payment-method mt-6">
        <h2 className="text-xl mb-4">Select Payment Method</h2>
        <div className="flex items-center mb-4">
          <input
            type="radio"
            id="cashOnDelivery"
            name="paymentMethod"
            value="cashOnDelivery"
            checked={paymentMethod === "cashOnDelivery"}
            onChange={handlePaymentMethodChange}
            className="mr-2"
          />
          <label htmlFor="cashOnDelivery" className="text-lg">
            Cash on Delivery
          </label>
        </div>
      </div>

      {/* Confirm Order Button */}
      <div className="mt-6">
        <button
          onClick={handlePlaceOrder}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Confirm Order
        </button>
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default ConfirmOrderPage;
