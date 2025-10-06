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
  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       const response = await axios.get(`${APP_URL}/OrdersControllers`);
  //       setOrders(response.data);
  //     } catch (error) {
  //       console.error(error);
  //       toast.error("Failed to load orders");
  //     }
  //   };
  //   fetchOrders();
  // }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${APP_URL}/OrdersControllers`);

        // Filter out orders that are already Delivered
        const filteredOrders = response.data.filter((order) => {
          const trackers = order.trackers || [];
          const latestStatus =
            trackers.length > 0
              ? trackers[trackers.length - 1].status
              : "Pending";
          return latestStatus !== "Delivered" && latestStatus !== "Cancel";
        });

        setOrders(filteredOrders);
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
          setNewStatus(""); // reset on select change
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch order details");
        }
      };
      fetchOrder();
    }
  }, [selectedOrder]);

  // Update status
  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === status) {
      toast.error("Please select a valid next status");
      return;
    }

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
      <label className="block mb-2 font-semibold text-gray-800 dark:text-green-500">
        Select Order:
      </label>
      <select
        value={selectedOrder}
        onChange={(e) => setSelectedOrder(e.target.value)}
        className="w-full p-3 mb-4 border rounded-lg bg-white text-gray-800 dark:bg-blue-200"
      >
        <option value="">-- Choose an Order --</option>
        {orders.map((order) => (
          <option key={order.id} value={order.id}>
            Order #{order.id} - {order.productName}
          </option>
        ))}
      </select>

      {/* Show Order Status & Update Option */}
      {selectedOrder && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-yellow-500">
            Current Status:
          </h3>
          <p className="mb-4 text-gray-700 dark:text-pink-500">
            {status || "Pending"}
          </p>

          {/* Status Update */}
          {status !== "Delivered" && status !== "Cancel" ? (
            <>
              <label className="block mt-6 font-semibold text-gray-800 dark:text-green-500">
                Update Status:
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white text-gray-800 mt-2 dark:bg-blue-200"
              >
                <option value="">-- Select New Status --</option>

                {status === "Pending" && (
                  <>
                    <option value="Confirm">Confirm</option>
                    <option value="Cancel">Cancel</option>
                  </>
                )}
                {status === "Confirm" && (
                  <option value="Dispatched">Dispatched</option>
                )}
                {status === "Dispatched" && (
                  <option value="Out for Delivery">Out for Delivery</option>
                )}
                {status === "Out for Delivery" && (
                  <option value="Delivered">Delivered</option>
                )}
              </select>

              {/* Update Button */}
              <button
                onClick={handleUpdateStatus}
                className={`mt-4 w-full py-2 px-4 rounded-lg transition bg-blue-600 text-white hover:bg-blue-700`}
              >
                Update Status
              </button>
            </>
          ) : (
            <p className="text-gray-500 mt-4 italic">
              No further updates allowed. This order is{" "}
              <span className="font-semibold">{status}</span>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderTrackerStatus;
