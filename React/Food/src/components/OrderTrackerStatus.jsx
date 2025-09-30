import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const APP_URL = import.meta.env.VITE_LOCAL_URL;

function OrderTrackerStatus() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [status, setStatus] = useState("");
  const [newStatus, setNewStatus] = useState("");

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${APP_URL}/OrdersControllers`);
        //console.log("Fetch data are", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load orders");
      }
    };
    fetchOrders();
  }, []);

  // Fetch order details when one is selected
  useEffect(() => {
    if (selectedOrder) {
      const fetchOrder = async () => {
        try {
          const res = await axios.get(
            `${APP_URL}/OrdersControllers/order/${selectedOrder}`
          );

          const trackers = res.data.trackers || [];
          const latestStatus =
            trackers.length > 0
              ? trackers[trackers.length - 1].status
              : "Pending";

          setStatus(latestStatus);
          setNewStatus(latestStatus); // set dropdown to current status
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch order details");
        }
      };
      fetchOrder();
    }
  }, [selectedOrder]);

  // Update status when button is clicked
  const handleUpdateStatus = async () => {
    try {
      await axios.put(`${APP_URL}/OrderTrackers/${selectedOrder}/status`, {
        status: newStatus,
      });
      setStatus(newStatus);
      toast.success("Order status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        📦 Order Tracker
      </h2>

      {/* Select Order */}
      <label className="block mb-2 font-semibold text-gray-800">
        Select Order:
      </label>
      <select
        value={selectedOrder}
        onChange={(e) => setSelectedOrder(e.target.value)}
        className="w-full p-3 mb-4 border rounded-lg bg-white text-gray-800"
      >
        <option value="">-- Choose an Order --</option>
        {orders.map((order) => (
          <option key={order.id} value={order.id}>
            Order #{order.id} - {order.productName}
          </option>
        ))}
      </select>

      {selectedOrder && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Current Status:
          </h3>
          <p className="mb-4 text-gray-700">{status || "Pending"}</p>

          {/* Status Update */}
          <label className="block mt-6 font-semibold text-gray-800">
            Update Status:
          </label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white text-gray-800 mt-2"
          >
            <option value="Pending">Pending</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>

          {/* Update Button */}
          <button
            onClick={handleUpdateStatus}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Update Status
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderTrackerStatus;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// const APP_URL = import.meta.env.VITE_LOCAL_URL;

// function OrderTracker() {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState("");
//   const [status, setStatus] = useState("");

//   // Ordered status flow
//   const steps = ["Pending", "Dispatched", "Out for Delivery", "Delivered"];

//   // Fetch all orders
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get(`${APP_URL}/OrdersControllers`);
//         setOrders(response.data);
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to load orders");
//       }
//     };
//     fetchOrders();
//   }, []);

//   // Fetch selected order details
//   useEffect(() => {
//     if (selectedOrder) {
//       const fetchOrder = async () => {
//         try {
//           const res = await axios.get(
//             `${APP_URL}/OrdersControllers/order/${selectedOrder}`
//           );
//           const trackers = res.data.trackers || [];
//           const latestStatus =
//             trackers.length > 0
//               ? trackers[trackers.length - 1].status
//               : "Pending";
//           setStatus(latestStatus);
//         } catch (err) {
//           console.error(err);
//           toast.error("Failed to fetch order details");
//         }
//       };
//       fetchOrder();
//     }
//   }, [selectedOrder]);

//   // Update status to the next step
//   const handleNextStep = async () => {
//     const currentIndex = steps.indexOf(status);
//     if (currentIndex === -1 || currentIndex === steps.length - 1) {
//       toast.error("Already at final step");
//       return;
//     }

//     const nextStatus = steps[currentIndex + 1];

//     try {
//       await axios.put(`${APP_URL}/OrderTrackers/${selectedOrder}/status`, {
//         status: nextStatus,
//       });
//       setStatus(nextStatus);
//       toast.success(`Order moved to "${nextStatus}"`);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update order status");
//     }
//   };

//   return (
//     <div className="p-8 max-w-2xl mx-auto h-screen">
//       <h2 className="text-2xl font-bold mb-4 text-blue-700">
//         📦 Order Tracker
//       </h2>

//       {/* Select Order */}
//       <label className="block mb-2 font-semibold text-gray-800">
//         Select Order:
//       </label>
//       <select
//         value={selectedOrder}
//         onChange={(e) => setSelectedOrder(e.target.value)}
//         className="w-full p-3 mb-4 border rounded-lg bg-white text-gray-800"
//       >
//         <option value="">-- Choose an Order --</option>
//         {orders.map((order) => (
//           <option key={order.id} value={order.id}>
//             Order #{order.id} - {order.productName}
//           </option>
//         ))}
//       </select>

//       {selectedOrder && (
//         <div className="mt-6">
//           {/* Stepper UI */}
//           <div className="flex justify-between items-center mb-6">
//             {steps.map((step, index) => {
//               const currentIndex = steps.indexOf(status);
//               const isCompleted = index < currentIndex;
//               const isActive = index === currentIndex;

//               return (
//                 <div key={step} className="flex-1 text-center">
//                   <div
//                     className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full border-2
//                       ${
//                         isCompleted
//                           ? "bg-green-500 text-white border-green-500"
//                           : isActive
//                           ? "bg-blue-500 text-white border-blue-500"
//                           : "bg-gray-200 text-gray-600 border-gray-300"
//                       }`}
//                   >
//                     {index + 1}
//                   </div>
//                   <p
//                     className={`mt-2 text-sm font-semibold ${
//                       isActive
//                         ? "text-blue-600"
//                         : isCompleted
//                         ? "text-green-600"
//                         : "text-gray-500"
//                     }`}
//                   >
//                     {step}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Next Step Button */}
//           <button
//             onClick={handleNextStep}
//             disabled={status === "Delivered"}
//             className={`w-full py-2 px-4 rounded-lg transition ${
//               status === "Delivered"
//                 ? "bg-gray-400 text-gray-200 cursor-not-allowed"
//                 : "bg-blue-600 text-white hover:bg-blue-700"
//             }`}
//           >
//             {status === "Delivered"
//               ? "Order Completed"
//               : "Move to Next Step"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default OrderTracker;
