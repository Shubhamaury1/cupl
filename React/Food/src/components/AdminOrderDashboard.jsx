import React, { useEffect, useState } from "react";
import axios from "axios";
const APP_URL = import.meta.env.VITE_LOCAL_URL;

function AdminOrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        //Fetch total order
        const response = await axios.get(`${APP_URL}/OrdersControllers`);
        console.log("order history", response.data);
        setOrders(response.data);

        // Fetch total users
        const usersResponse = await axios.get(`${APP_URL}/Users`);
        setTotalUsers(usersResponse.data.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboardData();
  }, []);

  // Filter orders by status
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.trackers[o.trackers.length - 1].status === "Pending"
  ).length;
  const dispatchedOrders = orders.filter(
    (o) => o.trackers[o.trackers.length - 1].status === "Dispatched"
  ).length;
  const outForDeliveryOrders = orders.filter(
    (o) => o.trackers[o.trackers.length - 1].status === "Out for Delivery"
  ).length;
  const deliveredOrders = orders.filter(
    (o) => o.trackers[o.trackers.length - 1].status === "Delivered"
  ).length;
  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

  const cardData = [
    { title: "Total Orders", value: totalOrders, color: "bg-blue-500" },
    { title: "Pending Orders", value: pendingOrders, color: "bg-yellow-500" },
    {
      title: "Dispatched Orders",
      value: dispatchedOrders,
      color: "bg-purple-500",
    },
    {
      title: "Out for Delivery",
      value: outForDeliveryOrders,
      color: "bg-orange-500",
    },
    {
      title: "Delivered Orders",
      value: deliveredOrders,
      color: "bg-green-500",
    },
    { title: "Total Users", value: totalUsers, color: "bg-pink-500" },
    { title: "Total Revenue", value: `₹${totalRevenue}`, color: "bg-red-500" },
  ];

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
      {cardData.map((card) => (
        <div
          key={card.title}
          className={`p-6 rounded-xl shadow-md text-white ${card.color}`}
        >
          <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
          <p className="text-2xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminOrderDashboard;
