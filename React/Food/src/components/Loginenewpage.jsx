
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Address from "./Address";
import { jwtDecode } from "jwt-decode";

const APP_URL = import.meta.env.VITE_LOCAL_URL;

function Loginenewpage() {
  // ✅ Initialize username directly from token
  const initialUsername = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.username || "";
      } catch (err) {
        console.error("Error decoding token", err);
        return "";
      }
    }
    return "";
  };

  const [currentPage, setCurrentPage] = useState("welcome");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("orderHistory");
  const [username, setUsername] = useState(initialUsername);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // ✅ Run once on page load to check token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decode = jwtDecode(token);
        const loggedIn =
          decode.isLoggedIn === "true" || decode.isLoggedIn === true;
        if (loggedIn) {
          setIsLoggedIn(true);
          setCurrentPage("home");
          if (decode.username) setUsername(decode.username);
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${APP_URL}/Authentication/Login`, {
        name: loginData.username,
        password: loginData.password,
      });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        const decoded = jwtDecode(response.data.token);
        setUsername(decoded.username || loginData.username); // fallback
        setIsLoggedIn(true);
        setCurrentPage("home");
        toast.success("Login successful!");
      }
    } catch (error) {
      toast.error("Invalid credentials! Please register.");
      setCurrentPage("register");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${APP_URL}/Authentication/Registration`,
        {
          name: registerData.username,
          email: registerData.email,
          password: registerData.password,
        }
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        const decoded = jwtDecode(response.data.token);
        setUsername(decoded.username || registerData.username);
        setIsLoggedIn(true);
        setCurrentPage("home");
        toast.success("Registered successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data || "Something went wrong!");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
    toast.success("You are logged out successfully.");
    localStorage.removeItem("token");
    setLoginData({ username: "", password: "" });
    setRegisterData({ username: "", email: "", password: "" });
    setUsername("");
    setCurrentPage("welcome");
  };

  // Sidebar
  const renderSidebar = () => (
    <aside className="w-64 bg-gray-900 text-white p-6 min-h-screen">
      <Link to="/">
        <h2 className="text-xl font-bold mb-6">
          Welcome {username || "Loading..."}
        </h2>
      </Link>
      <ul className="space-y-4">
        <li
          className={`cursor-pointer hover:text-gray-300 ${
            activeTab === "orderHistory" ? "text-blue-400" : ""
          }`}
          onClick={() => setActiveTab("orderHistory")}
        >
          Order History
        </li>
        <li
          className={`cursor-pointer hover:text-gray-300 ${
            activeTab === "address" ? "text-blue-400" : ""
          }`}
          onClick={() => setActiveTab("address")}
        >
          Manage Address
        </li>
        <li
          className="cursor-pointer hover:text-red-300 text-red-500 font-semibold"
          onClick={handleLogout}
        >
          Logout
        </li>
      </ul>
    </aside>
  );

  // Address Page
  const renderAddress = () => (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Manage Address</h1>
      <Address />
    </div>
  );

  // Order History
  const [orders, setOrders] = useState([]);
  const loginWarningShownRef = useRef(false);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decode = jwtDecode(token);
        const userid = decode.userid;
        if (!userid) {
          if (!loginWarningShownRef.current) {
            toast("You are not logged in. Please log in first.", {
              icon: "⚠️",
              duration: 4000,
            });
            loginWarningShownRef.current = true;
          }
          return;
        }

        const response = await axios.get(
          `${APP_URL}/OrdersControllers/${userid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(response.data);
      } catch (error) {
        console.error("Error loading orders:", error);
      }
    };

    if (isLoggedIn) {
      fetchOrder();
    }
  }, [isLoggedIn]);

  const renderOrderHistory = () => (
    <div className="p-8 text-gray-800 dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-6 dark:text-green-500">
        Order History
      </h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => {
          const latestTracker =
            order.trackers && order.trackers.length > 0
              ? order.trackers[order.trackers.length - 1]
              : { status: "Pending", date: "20-09-2025" };

          return (
            <div key={order.id} className="mb-8">
              <div className="border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center dark:bg-blue-100">
                <div className="mb-4 sm:mb-0 flex justify-center sm:justify-start">
                  <img
                    src={order.imageUrl}
                    alt={order.productName}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
                <div className="flex flex-col sm:flex-1 justify-center items-center sm:items-start pl-4 sm:pl-6">
                  <p className="text-lg font-semibold text-gray-900 dark:text-blue-600 text-center sm:text-left">
                    {order.productName}
                  </p>
                  <p className="text-sm text-gray-700 font-medium dark:text-green-600">
                    Ordered on: {order.orderDate}
                  </p>
                </div>
                <div className="flex flex-col justify-between items-center sm:items-end pl-4 sm:pl-6 mt-4 sm:mt-0">
                  <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mt-2">
                    Order: Confirm
                  </span>
                  <div className="mt-2">
                    <button
                      onClick={() => navigate(`/orderdetails/${order.id}`)}
                      className="text-blue-600 hover:underline text-sm dark:text-green-500"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  const renderHome = () => (
    <div className="flex min-h-screen">
      {renderSidebar()}
      <main className="flex-1 bg-gray-100">
        {activeTab === "orderHistory" ? renderOrderHistory() : renderAddress()}
      </main>
    </div>
  );

  // Welcome Page
  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome to BiteMeBaby!
      </h1>
      <div className="space-x-4">
        <button
          onClick={() => setCurrentPage("login")}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </button>
        <button
          onClick={() => setCurrentPage("register")}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Register
        </button>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Login</h2>
      <form
        onSubmit={handleLogin}
        className="flex flex-col item-center bg-white p-10 rounded-md shadow-md"
      >
        <div className="p-2">
          <label className="text-gray-800">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={loginData.username}
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
            required
            className="w-full mt-1 p-2 border rounded bg-white text-gray-800"
          />
        </div>
        <div className="p-2">
          <label className="text-gray-800">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
            className="w-full mt-1 p-2 border rounded bg-white text-gray-800"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );

  const renderRegister = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Register</h2>
      <form
        onSubmit={handleRegister}
        className="flex flex-col item-center bg-white p-10 rounded-md shadow-md w-full max-w-md"
      >
        {[
          ["Username", "username"],
          ["Email", "email"],
          ["Password", "password", "password"],
        ].map(([label, name, type = "text"]) => (
          <div key={name}>
            <label className="block mt-3 text-gray-800">{label}</label>
            <input
              type={type}
              name={name}
              value={registerData[name]}
              onChange={(e) =>
                setRegisterData({ ...registerData, [name]: e.target.value })
              }
              required
              className="w-full border px-3 py-2 rounded bg-white text-gray-800"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-5"
        >
          Register
        </button>
      </form>
    </div>
  );

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {currentPage === "welcome" && renderWelcome()}
      {currentPage === "login" && renderLogin()}
      {currentPage === "register" && renderRegister()}
      {currentPage === "home" && isLoggedIn && renderHome()}
    </>
  );
}

export default Loginenewpage;
