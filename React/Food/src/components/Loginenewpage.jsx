
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Address from "./Address";
import { jwtDecode } from "jwt-decode";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const APP_URL = import.meta.env.VITE_LOCAL_URL;

function Loginenewpage() {
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

  const [currentPage, setCurrentPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("orderHistory");
  const [username, setUsername] = useState(initialUsername);
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: "", password: "" });

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

  // Password Validation Function
  const validatePassword = (password) => {
    const minLength = /.{6,}/;
    const uppercase = /[A-Z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!minLength.test(password)) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    if (!uppercase.test(password)) {
      toast.error("Password must include at least one uppercase letter.");
      return false;
    }
    if (!number.test(password)) {
      toast.error("Password must include at least one number.");
      return false;
    }
    if (!specialChar.test(password)) {
      toast.error("Password must include at least one special character.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.username || !loginData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    //Validate Password Before Sending Request
    if (!validatePassword(loginData.password)) {
      return;
    }

    try {
      const response = await axios.post(`${APP_URL}/Authentication/Login`, {
        name: loginData.username,
        password: loginData.password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        const decoded = jwtDecode(response.data.token);
        setUsername(decoded.username || loginData.username);
        setIsLoggedIn(true);
        navigate("/");
        toast.success("Login successful!");
      }
    } catch (error) {
      toast.error("Invalid credentials! Please register first.");
      setCurrentPage("register");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
    toast.success("You are logged out successfully.");
    localStorage.removeItem("token");
    setLoginData({ username: "", password: "" });
    setUsername("");
    setCurrentPage("welcome");
  };

  // Sidebar
  const renderSidebar = () => (
    <aside className="w-64 bg-gray-900 text-white p-6 min-h-screen">
      <Link to="/" className="flex flex-cols mt-5">
        <IoArrowBackCircleOutline className="text-3xl mr-2" />
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

  const renderLogin = () => (
    <div className="flex min-h-screen text-gray-800">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-200 p-8">
        <div className="w-full max-w-md rounded-lg shadow-lg shadow-pink-500">
          <h1 className="text-4xl font-bold mb-6 text-pink-500 text-center mt-8">
            AllDayEats
          </h1>
          <h2 className="text-xl font-semibold mb-2 text-center dark:text-pink-400">
            Welcome Back
          </h2>
          <form
            onSubmit={handleLogin}
            className="flex flex-col space-y-6 mt-10"
          >
            <div>
              <label className="dark:text-white">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Rahul"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
              />
            </div>

            <div>
              <label className="dark:text-white">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Rahul@123"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-[310px] bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition"
            >
              Sign In
            </button>
            <p
              className="text-sm text-blue-700 hover:underline cursor-pointer"
              onClick={() => navigate("/forgotpassword")}
            >
              Forgot Password
            </p>
          </form>

          <p className="text-center text-sm mt-4 text-gray-700 mb-6 dark:text-white">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/registerwithotp")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden md:block md:w-1/2 bg-cover bg-center">
        <img src="src/assets/Order food-pana.png" alt="" />
      </div>
    </div>
  );

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {currentPage === "login" && renderLogin()}
      {currentPage === "home" && isLoggedIn && renderHome()}
    </>
  );
}

export default Loginenewpage;
