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
  const [showCODPopup, setShowCODPopup] = useState(false); // 👈 Popup state
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

    if (!paymentMethod) {
      toast.error("Please select a payment method before proceeding.");
      return;
    }

    if (paymentMethod === "cashOnDelivery") {
      setShowCODPopup(true); // 👈 Show popup before confirming COD
      return;
    }

    await handleOnlinePayment();
  };

  // Function to confirm and place COD order
  const confirmCODOrder = async () => {
    setShowCODPopup(false);
    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    const userid = decode.userid;
    const selectedAddress = address[selectedAddressIndex];

    const newOrder = {
      uId: userid,
      addressId: selectedAddress.id,
      paymentMethod,
    };

    try {
      await axios.post(`${APP_URL}/OrdersControllers`, newOrder);
      toast.success("Order placed successfully!");
      navigate("/success");
    } catch (error) {
      toast.error("Failed to place COD order");
      console.error(error);
    }
  };

  // Razorpay Payment Flow
  const handleOnlinePayment = async () => {
    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    const userid = decode.userid;
    const selectedAddress = address[selectedAddressIndex];

    const newOrder = {
      uId: userid,
      addressId: selectedAddress.id,
      paymentMethod,
    };

    try {
      const amount = totalPrice;
      const orderResponse = await axios.post(
        `${APP_URL}/Razorpay/CreateOrder`,
        {
          amount,
        }
      );

      const { key, orderId } = orderResponse.data;
      const options = {
        key,
        amount: amount * 100,
        order_id: orderId,
        handler: async function (response) {
          const verify = await axios.post(`${APP_URL}/Razorpay/VerifyPayment`, {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (verify.data.message === "Payment Verified") {
            await axios.post(`${APP_URL}/OrdersControllers`, newOrder);
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
                <div className="font-medium text-gray-800">
                  Name: {addr.userName}
                </div>
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

      {/* COD Confirmation Popup */}
      {showCODPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Confirm Cash on Delivery
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to place this order with Cash on Delivery?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmCODOrder}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Yes
              </button>
              <button
                onClick={() => setShowCODPopup(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default ConfirmOrderPage;
