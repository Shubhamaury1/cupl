import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PaymentMethod from "../components/PaymentMethod";
import { jwtDecode } from "jwt-decode";

const APP_URL = import.meta.env.VITE_LOCAL_URL;

function ConfirmOrderPage() {
  const [address, setAddress] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cart);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.PQunatity * item.price,
    0
  );

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddress = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const decode = jwtDecode(token);
      const userid = decode.userid;
      try {
        const res = await axios.get(`${APP_URL}/Addresses/${userid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        //console.log("Address",res)
        setAddress(res.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddress();
  }, []);

  const handleAddressSelection = (index) => setSelectedAddressIndex(index);
  const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);

  // Main order handler
  const handlePlaceOrder = async () => {
    if (selectedAddressIndex === null) {
      toast.error("Please select an address before placing the order.");
      return;
    }
    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    const userid = decode.userid;
    const selectedAddress = address[selectedAddressIndex];

    const newOrder = {
      uId: userid,
      addressId: selectedAddress.id,
      paymentMethod,
    };

    // COD → Direct order
    if (paymentMethod === "cashOnDelivery") {
      try {
        await axios.post(`${APP_URL}/OrdersControllers`, newOrder);
        toast.success("Order placed successfully!");
        navigate("/success");
      } catch (error) {
        toast.error("Failed to place COD order");
        console.error(error);
      }
      return;
    }
    // Other methods → Razorpay payment
    try {
      const amount = totalPrice; // Replace with dynamic total price
      const orderResponse = await axios.post(
        `${APP_URL}/Razorpay/CreateOrder`,
        { amount }
      );
      //console.log("hhh",orderResponse)
      const { key, orderId } = orderResponse.data;
      const options = {
        key,
        amount: amount * 100,
        order_id: orderId,
        handler: async function (response) {
          // Verify payment
          const verify = await axios.post(`${APP_URL}/Razorpay/VerifyPayment`, {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (verify.data.message === "Payment Verified") {
            // Save order in DB after payment success
            await axios.post(`${APP_URL}/OrdersControllers`, newOrder);
            console.log("order",newOrder)
            toast.success("Payment successful! Order placed.");
            navigate("/success");
          } else {
            toast.error("Payment verification failed");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("Error initiating Razorpay payment");
      console.error(error);
    }
  };
  return (
    <div className="text-gray-600 max-w-4xl mx-auto p-4 h-screen">
      <h1 className="text-2xl font-semibold mb-6 dark:text-green-500">
        Confirm Your Order
      </h1>
      {/* Address Selection */}
      <div>
        <h2 className="text-xl mb-4 dark:text-blue-400">Select Your Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="font-medium text-gray-800">Name: {addr.userName}</div>
                <div>Phone: {addr.phone}</div>
                <div>House: {addr.houseNumber}</div>
                <div>Pincode: {addr.pinCode}</div>
                <div>Type: {addr.addressType}</div>
                <div>LandMark: {addr.landMark}</div>
                <div>City: {addr.city}</div>
                <div>Country: {addr.region}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Payment Method */}
      <PaymentMethod
        paymentMethod={paymentMethod}
        handlePaymentMethodChange={handlePaymentMethodChange}
      />

      {/* Confirm Button */}
      <div className="mt-6">
        <button
          onClick={handlePlaceOrder}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          {paymentMethod === "cashOnDelivery"
            ? "Confirm Order"
            : "Proceed to Pay"}
        </button>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
export default ConfirmOrderPage;
