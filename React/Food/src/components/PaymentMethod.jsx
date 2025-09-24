import React from "react";
import toast, { Toaster } from "react-hot-toast";
const paymentOptions = [
  {
    id: "cashOnDelivery",
    label: "Cash on Delivery",
    value: "cashOnDelivery",
    image: "https://img.icons8.com/ios-filled/50/cash-in-hand.png",
  },
  {
    id: "netBanking",
    label: "Net Banking",
    value: "netBanking",
    image: "https://img.icons8.com/ios-filled/50/bank.png",
  },
  {
    id: "upi",
    label: "UPI",
    value: "upi",
    image: "https://img.icons8.com/ios-filled/50/qr-code.png",
  },
  {
    id: "creditCard",
    label: "Credit/Debit Card",
    value: "creditCard",
    image: "https://img.icons8.com/ios-filled/50/bank-card-front-side.png",
  },  
];

const PaymentMethod = ({ paymentMethod, handlePaymentMethodChange }) => {
  return (
    <div className="payment-method mt-6">
      <h2 className="text-xl mb-4 dark:text-green-500">
        Select Payment Method
      </h2>

      <div className="flex flex-col space-y-4">
        {paymentOptions.map((method) => (
          <div
            key={method.id}
            className="flex items-center p-4 bg-white rounded-xl shadow-md dark:bg-blue-200 dark:shadow-blue-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-blue-300"
          >
            <input
              type="radio"
              id={method.id}
              name="paymentMethod"
              value={method.value}
              checked={paymentMethod === method.value}
              onChange={handlePaymentMethodChange}
              className="appearance-none w-4 h-4 rounded-full border border-gray-400 bg-white checked:bg-white checked:border-green checked:ring-2 checked:ring-green cursor-pointer"
            />
            <label
              htmlFor={method.id}
              className="text-lg dark:text-blue-400 flex-1 cursor-pointer ml-4"
            >
              {method.label}
            </label>
            <img
              src={method.image}
              alt={method.label}
              className="w-10 h-10 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;
