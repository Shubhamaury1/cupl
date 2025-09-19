// import React, { useEffect, useState } from "react";

// function OrderDetails() {
//   const [order, setOrder] = useState(null);

//   useEffect(() => {
//     const stored = localStorage.getItem("lastOrder");
//     if (stored) {
//       setOrder(JSON.parse(stored));
//     }
//   }, []);

//   if (!order) {
//     return <p className="p-8 text-gray-700">No order details available.</p>;
//   }

//   return (
//     <div className="p-8 text-gray-800">
//       <h1 className="text-2xl font-bold mb-4">Order Details</h1>

//       {/* Shipping Address */}
//       <div className="mb-6 bg-gray-100 p-4 rounded shadow">
//         <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
//         <p>
//           <strong>Name:</strong> {order.address.name}
//         </p>
//         <p>
//           <strong>Phone:</strong> {order.address.phone}
//         </p>
//         <p>
//           <strong>Address:</strong> {order.address.house},{" "}
//           {order.address.landmark}, {order.address.city},{" "}
//           {order.address.country} - {order.address.pincode}
//         </p>
//       </div>

//       {/* Ordered Items */}
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold mb-2">Ordered Items</h2>
//         <div className="space-y-4">
//           {order.items.map((item, idx) => (
//             <div
//               key={idx}
//               className="flex gap-4 items-center border p-4 rounded shadow"
//             >
//               <img
//                 src={item.image}
//                 className="w-20 h-20 object-cover rounded"
//               />
//               <div className="flex-1">
//                 <p className="text-lg font-semibold">{item.name}</p>
//                 <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
//                 <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
//                 <p className="text-sm text-gray-600">
//                   Total Price: ₹{item.qty * item.price}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OrderDetails;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams(); // Get order ID from URL
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("orderHistory");
    if (stored) {
      const orders = JSON.parse(stored);
      const found = orders.find((o) => o.id.toString() === id.toString());
      if (found) {
        setOrder(found);
      }
    }
  }, [id]);

  if (!order) {
    return <p className="p-8 text-gray-700">Order not found.</p>;
  }
    return (
      <div className="max-w-4xl mx-auto p-6 text-gray-800">
        <h1 className="text-3xl font-bold mb-6 border-b pb-2 dark:text-green-500">
          Order Details
        </h1>

        {/* Order Summary */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2text-gray-800 dark:text-green-500">
            Order Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong className="dark:text-pink-200">Order Number:</strong>{" "}
                <span className="dark:text-white">{order.id}</span>
              </p>
              <p>
                <strong className="dark:text-pink-200">Order Placed:</strong>{" "}
                <span className="dark:text-white">
                  {new Date(order.id).toLocaleDateString("en-GB")}
                </span>
              </p>
            </div>
            <div>
              <p>
                <strong className="dark:text-pink-200">Grand Total:</strong> ₹
                <span className="dark:text-white">{order.total}</span>
              </p>
              <p>
                <strong className="dark:text-pink-200">Status:</strong>{" "}
                <span className="text-green-600 font-medium dark:text-blue-500">
                  Confirmed
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Shipping Address */}
        <section className="mb-6 bg-gray-50 p-4 rounded-lg shadow dark:bg-blue-100">
          <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
          <div className="text-sm">
            <p>
              <strong>Name:</strong> {order.address.userName}
            </p>
            <p>
              <strong>Phone:</strong> {order.address.phone}
            </p>
            <p>
              <strong>Address:</strong> {order.address.house},{" "}
              {order.address.landmark}, {order.address.city},{" "}
              {order.address.country} - {order.address.pincode}
            </p>
          </div>
        </section>

        {/* Ordered Items */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-green-500">
            Ordered Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 border rounded-lg p-4 shadow-sm bg-white dark:bg-orange-200"
              >
                <img
                  src={item.image}
                  className="w-20 h-20 object-cover rounded border dark:text-gray-900"
                />
                <div className="flex-1 text-sm dark:text-green-600">
                  <p className="font-semibold text-base">{item.name}</p>
                  <p>
                    <span className="dark:font-bold">Quantity:</span>{" "}
                    {item.PQunatity}
                  </p>
                  <p>
                    <span className="dark:font-bold">Price:</span>₹{item.price}
                  </p>
                  <p className="text-gray-700 font-medium  dark:text-green-600">
                    <span className="dark:font-bold">Total:</span> ₹
                    {item.PQunatity * item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
}
export default OrderDetails;
