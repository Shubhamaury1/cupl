import React from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const APP_URL = import.meta.env.VITE_LOCAL_URL; // your .NET API base URL

export default function RazorpayPayment({ amount, onSuccess }) {

const [isPaying, setIsPaying] = useState(false);

const handlePay = async () => {
  if (isPaying) return; // prevent multiple opens
  setIsPaying(true);

  try {
    const res = await axios.post(`${APP_URL}/Razorpay/CreateOrder`, { amount });
    const { key, orderId } = res.data;

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
          toast.success("Payment successful!");
          if (onSuccess) onSuccess();
        } else {
          toast.error("Payment verification failed");
        }
      },
      theme: { color: "#3399cc" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error(error);
    toast.error("Error initiating payment");
  } finally {
    setIsPaying(false);
  }
};



  // const handlePay = async () => {
  //   try {
  //     // Step 1: Create order from backend
  //     const res = await axios.post(`${APP_URL}/Razorpay/CreateOrder`, {
  //       amount,
  //     });

  //     const { key, orderId } = res.data;

  //     // Step 2: Configure Razorpay
  //     const options = {
  //       key,
  //       amount: amount * 100,
  //       order_id: orderId,
  //       handler: async function (response) {
  //         const verify = await axios.post(`${APP_URL}/Razorpay/VerifyPayment`, {
  //           razorpayOrderId: response.razorpay_order_id,
  //           razorpayPaymentId: response.razorpay_payment_id,
  //           razorpaySignature: response.razorpay_signature,
  //         });

  //         if (verify.data.message === "Payment Verified") {
  //           toast.success("Payment successful!");
  //           if (onSuccess) onSuccess();
  //         } else {
  //           toast.error("Payment verification failed");
  //         }
  //       },
  //       theme: {
  //         color: "#3399cc",
  //       },
  //     };

  //     // Step 3: Open Razorpay popup
  //     const razorpay = new window.Razorpay(options);
  //     razorpay.open();
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Error initiating payment");
  //   }
  // };

  return (
    <div className="mt-6">
      <button
        onClick={handlePay}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Pay ₹{amount}
      </button>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
