// import React, { useEffect, useState } from "react";

// function Order() {
//   const [order, setOrder] = useState(null);

//   useEffect(() => {
//     const storedOrder = localStorage.getItem("lastOrder");
//     if (storedOrder) {
//       setOrder(JSON.parse(storedOrder));
//     }
//   }, []);

//   if (!order) {
//     return <div className="p-8 text-gray-700">No order found.</div>;
//   }

//   return (
//     <div className="p-8 text-gray-800">
//       <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>

//       <div className="mb-6">
//         <h2 className="text-xl font-semibold mb-2">Shipping Address:</h2>
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

//       <div className="mb-6">
//         <h2 className="text-xl font-semibold mb-2">Order Items:</h2>
//         <table className="w-full table-auto border border-collapse border-gray-300">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border px-4 py-2 text-left">Item</th>
//               <th className="border px-4 py-2 text-left">Quantity</th>
//               <th className="border px-4 py-2 text-left">Price</th>
//               <th className="border px-4 py-2 text-left">Subtotal</th>
//             </tr>
//           </thead>
//           <tbody>
//             {order.items.map((item, index) => (
//               <tr key={index}>
//                 <td className="border px-4 py-2">{item.name}</td>
//                 <td className="border px-4 py-2">{item.quantity}</td>
//                 <td className="border px-4 py-2">₹{item.price}</td>
//                 <td className="border px-4 py-2">
//                   ₹{item.price * item.quantity}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="mt-4 text-right text-lg font-semibold">
//           Total: ₹{order.total}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Order;
import React, { useEffect, useState } from "react";

function Order() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("lastOrder");
    if (stored) {
      setOrder(JSON.parse(stored));
    }
  }, []);

  if (!order) return <p className="p-8 text-gray-700">No order found.</p>;

  return (
    <div className="p-8 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
        <p>
          <strong>Name:</strong> {order.address.name}
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

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Order Items</h2>
        <table className="w-full border text-left table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Item</th>
              <th className="border px-4 py-2">Qty</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.qty}</td>
                <td className="border px-4 py-2">₹{item.price}</td>
                <td className="border px-4 py-2">₹{item.price * item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-right text-lg font-bold">
          Total: ₹{order.total}
        </div>
      </div>
    </div>
  );
}

export default Order;
