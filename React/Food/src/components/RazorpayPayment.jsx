// import React from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const APP_URL = import.meta.env.VITE_LOCAL_URL;

// export default function RazorpayPayment({ amount = 500, onSuccess }) {
//   // amount is in rupees (e.g., 500)
//   const handlePay = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("Please login first");
//         return;
//       }
//       const decode = jwtDecode(token);
//       const UId = decode.userid ? parseInt(decode.userid) : undefined;

//       // Create order on server
//       const createResp = await axios.post(
//         `${APP_URL}/Razorpay/create-order`,
//         {
//           amount, // rupees
//           currency: "INR",
//           uId: UId,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const {
//         order_id,
//         amount: amountInPaise,
//         currency,
//         key,
//       } = createResp.data;

//       const options = {
//         key, // razorpay key id
//         amount: amountInPaise, // amount in paise
//         currency: currency,
//         name: "BiteMeBaby", // your business name
//         description: "Order Payment",
//         order_id: order_id,
//         handler: async function (response) {
//           // response has razorpay_payment_id, razorpay_order_id, razorpay_signature
//           try {
//             // Verify payment with server
//             const verifyResp = await axios.post(
//               `${APP_URL}/Razorpay/verify-payment`,
//               {
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_signature: response.razorpay_signature,
//                 uId: UId,
//               },
//               { headers: { Authorization: `Bearer ${token}` } }
//             );

//             if (
//               verifyResp.data?.status === "success" ||
//               verifyResp.status === 200
//             ) {
//               // call optional onSuccess callback (e.g., place order + clear cart)
//               if (onSuccess)
//                 onSuccess({ payment: response, verify: verifyResp.data });
//               alert("Payment successful and verified!");
//             } else {
//               alert("Payment verification failed");
//             }
//           } catch (err) {
//             console.error("Verification error:", err);
//             alert("Server verification failed");
//           }
//         },
//         prefill: {
//           name: decode.username || "",
//           email: decode.email || "",
//           contact: decode.phone || "",
//         },
//         theme: { color: "#528FF0" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error("Error creating order:", err);
//       alert("Could not initiate payment. Check console.");
//     }
//   };

//   return (
//     <button
//       onClick={handlePay}
//       className="px-4 py-2 bg-blue-600 text-white rounded"
//     >
//       Pay ₹{amount}
//     </button>
//   );
// }


import React, { useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const APP_URL = import.meta.env.VITE_LOCAL_URL;

export default function RazorpayPayment({ amount = 500, onSuccess }) {
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePay = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first");

      const decoded = jwtDecode(token);
      console.log("Decoded:", decoded);

      const orderResp = await axios.post(
        `${APP_URL}/Razorpay/create-order`,
        { amount, currency: "INR" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Order Response:", orderResp.data);

      const { order_id, amount: amt, currency, key } = orderResp.data;

      const options = {
        key,
        amount: amt,
        currency,
        name: "BiteMeBaby",
        description: "Food Order Payment",
        order_id,
        handler: async (response) => {
          try {
            const verifyResp = await axios.post(
              `${APP_URL}/Razorpay/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyResp.data.status === "success") {
              alert("Payment successful!");
              onSuccess?.(response);
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.error("Error verifying payment:", err);
            alert("Payment verification error");
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment init failed:", err);
      alert("Could not start Razorpay checkout.");
    }
  };

  return (
    <button
      onClick={handlePay}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Pay ₹{amount} with Razorpay
    </button>
  );
}
