import React, { useEffect, useState } from "react";
import axios from "axios";

const APP_URL = import.meta.env.VITE_LOCAL_URL;

function AdminMainPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${APP_URL}/OrdersControllers`);
        //console.log("fetch data are", response.data);
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  // Arrange the orderDate in dd-mm-yyyy-formate
  const parseOrderDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  const getDateFilters = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return { today, startOfWeek, startOfMonth };
  };

  const filterOrdersByDate = () => {
    const { today, startOfWeek, startOfMonth } = getDateFilters();
    const dailyOrders = [];
    const weeklyOrders = [];
    const monthlyOrders = [];
    orders.forEach((order) => {
      if (!order.orderDate) return;
      const orderDate = parseOrderDate(order.orderDate);
      const orderDay = new Date(orderDate);
      orderDay.setHours(0, 0, 0, 0);

      if (orderDay.getTime() === today.getTime()) {
        dailyOrders.push(order);
      }
      if (orderDate >= startOfWeek) {
        weeklyOrders.push(order);
      }
      if (orderDate >= startOfMonth) {
        monthlyOrders.push(order);
      }
    });

    return { dailyOrders, weeklyOrders, monthlyOrders };
  };
  //calculate total income in a day
  const calculateRevenue = (orders) =>
    orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  if (loading)
    return <div className="p-8 text-gray-700">Loading orders...</div>;
  const { dailyOrders, weeklyOrders, monthlyOrders } = filterOrdersByDate();

  const cards = [
    {
      title: "Today Order ",
      count: dailyOrders.length,
      revenue: calculateRevenue(dailyOrders),
      color: "from-green-500 to-green-300",
    },
    {
      title: "This Week Orders",
      count: weeklyOrders.length,
      revenue: calculateRevenue(weeklyOrders),
      color: "from-blue-500 to-blue-300",
    },
    {
      title: "This Month Orders",
      count: monthlyOrders.length,
      revenue: calculateRevenue(monthlyOrders),
      color: "from-purple-500 to-purple-300",
    },
  ];

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`p-6 rounded-xl shadow-md text-white bg-gradient-to-br ${card.color}`}
        >
          <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
          <p className="text-2xl font-bold">Orders: {card.count}</p>
          <p className="text-md mt-1">Revenue: ₹{card.revenue}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminMainPanel;
