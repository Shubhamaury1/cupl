import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function Loginenewpage() {
  const [currentPage, setCurrentPage] = useState("welcome"); // welcome, login, register, home
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("orderHistory"); // or 'address'
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (loggedIn) {
      setIsLoggedIn(true);
      setCurrentPage("home");
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) =>
        u.username === loginData.username && u.password === loginData.password
    );
    if (user) {
      setIsLoggedIn(true);
      setCurrentPage("home");
      localStorage.setItem("isLoggedIn", "true");
      toast.success("Login successful!");
    } else {
      toast.error("Invalid credentials! Please register.");
      setCurrentPage("register");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some(
      (user) => user.username === registerData.username
    );
    if (userExists) {
      toast.error("Username already exists!");
      return;
    }
    // Add new user
    users.push(registerData);
    localStorage.setItem("users", JSON.stringify(users));

    toast.success("Registered successfully!");
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    setCurrentPage("home");
  };

  // Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("home");
    localStorage.removeItem("isLoggedIn"); //Clear login
    setLoginData({ username: "", password: "" });
    setRegisterData({ username: "", email: "", password: "" });
  };

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

  const renderSidebar = () => (
    <aside className="w-64 bg-gray-900 text-white p-6 min-h-screen">
      <Link to="/">
        <h2 className="text-xl font-bold mb-6">User Panel</h2>
      </Link>

      <ul className="space-y-4">
        <li
          className={`cursor-pointer hover:text-gray-300 ${
            activeTab === "orderHistory" ? "text-blue-400" : ""
          }`}
          onClick={() => setActiveTab("orderHistory")}
          //onClick={() => navigate("/order")}
        >
          Order History
        </li>
        <li
          className={`cursor-pointer hover:text-gray-300 ${
            activeTab === "address" ? "text-blue-400" : ""
          }`}
          //onClick={() => setActiveTab("address")}
          onClick={() => navigate("/address")}
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
  // from the backend
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7076/api/OrdersControllers"
        );
        //console.log("Fetched Orders:", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("Error to loading:", error);
      }
    };
    fetchOrder();
  }, []);

  // Check if the trackers array has any elements
 const tracker =
   orders.trackers && orders.trackers.length > 0
     ? orders.trackers[0]
     : { Status: "Pending", Date: "20-09-2025" };
  
  
  const renderOrderHistory = () => {
    return (
      <div className="p-8 text-gray-800 dark:bg-gray-800">
        <h1 className="text-2xl font-bold mb-6 dark:text-green-500">
          Order History
        </h1>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            // <div key={order.id} className="mb-8">
            //   <div className="space-y-4">
            //     {/* Since each order is a single item, we don't need to map over order.items */}
            //     <div className="border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center dark:bg-blue-100">
            //       <div>
            //         <p className="text-lg font-semibold text-gray-900 dark:text-blue-600">
            //           {order.productName}
            //         </p>

            //         <p className="text-lg font-semibold text-gray-900 dark:text-blue-600">
            //           <img
            //             src={order.imageUrl}
            //             alt={order.productName}
            //             className="w-32 h-32 object-cover rounded-lg"
            //           />

            //         </p>

            //         <p className="text-sm text-gray-600 dark:text-green-600">
            //           Ordered on: {tracker.Date}
            //         </p>
            //       </div>
            //       <div className="flex flex-col mt-2 sm:mt-0">
            //         <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
            //           Ordered: Confirm
            //         </span>
            //         <button
            //           onClick={() => navigate(`/orderdetails/${order.id}`)}
            //           className="text-blue-600 hover:underline text-sm mt-2 dark:text-green-500"
            //         >
            //           View Details
            //         </button>
            //       </div>
            //     </div>
            //   </div>
            // </div>

            <div key={order.id} className="mb-8">
              <div className="space-y-4">
                {/* Order Item Card */}
                <div className="border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center dark:bg-blue-100">
                  {/* Left side: Image */}
                  <div className="mb-4 sm:mb-0 flex  justify-center sm:justify-start">
                    <img
                      src={order.imageUrl}
                      alt={order.productName}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    {/* <p className="text-sm text-gray-700 font-medium dark:text-green-600">
                      Ordered on: {tracker.Date}
                    </p> */}
                  </div>

                  {/* Middle: Product name */}
                  <div className="flex flex-col sm:flex-1 justify-center items-center sm:items-start pl-4 sm:pl-6">
                    <p className="text-lg font-semibold text-gray-900 dark:text-blue-600 text-center sm:text-left">
                      {order.productName}
                    </p>

                    {/* Ordered on date */}
                    <p className="text-sm text-gray-700 font-medium dark:text-green-600">
                      Ordered on: {tracker.Date}
                    </p>
                  </div>

                  {/* Right side: Status and View Details */}
                  <div className="flex flex-col justify-between items-center sm:items-end pl-4 sm:pl-6 mt-4 sm:mt-0">
                    {/* Ordered Status */}
                    <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mt-2">
                      Ordered: Confirm
                    </span>

                    {/* View Details Button */}
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
            </div>
          ))
        )}
      </div>
    );
  };

  const renderHome = () => (
    <div className="flex min-h-screen">
      {renderSidebar()}
      <main className="flex-1 bg-gray-100">
        {activeTab === "orderHistory" ? renderOrderHistory() : renderAddress()}
      </main>
    </div>
  );

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />;
      {currentPage === "welcome" && renderWelcome()}
      {currentPage === "login" && renderLogin()}
      {currentPage === "register" && renderRegister()}
      {currentPage === "home" && isLoggedIn && renderHome()}
    </>
  );
}

export default Loginenewpage;
