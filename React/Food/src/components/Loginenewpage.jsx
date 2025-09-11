import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
function Loginenewpage() {
  const [currentPage, setCurrentPage] = useState("welcome"); // welcome, login, register, home
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("orderHistory"); // or 'address'

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [saveaddress, SetSaveaddress] = useState({
    name: "",
    phone: "",
    house: "",
    landmark: "",
    addresstype: "",
    pincode: "",
    city: "",
    country: "",
  });
  // save addresss
  const handleSubmitAddress = (e) => {
    e.preventDefault();
    localStorage.setItem("shippingAddress", JSON.stringify(saveaddress));
    toast.success("Address saved successfully! 🚀");
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (loggedIn) {
      setIsLoggedIn(true);
      setCurrentPage("home");
    }
  }, []);
  // Dummy Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === "admin" && loginData.password === "12345") {
      setIsLoggedIn(true);
      setCurrentPage("home");
      localStorage.setItem("isLoggedIn", "true");
    } else {
      alert("Invalid credentials");
    }
  };

  // Dummy Register
  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registered:", registerData);
    setIsLoggedIn(true);
    setCurrentPage("home");
  };

  // Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("home");
    localStorage.removeItem("isLoggedIn"); // ✅ Clear login
    setLoginData({ username: "", password: "" });
    setRegisterData({ username: "", email: "", password: "" });
  };

  // ========================= Pages =========================

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
        >
          Order History
        </li>
        <li
          className={`cursor-pointer hover:text-gray-300 ${
            activeTab === "address" ? "text-blue-400" : ""
          }`}
          onClick={() => setActiveTab("address")}
        >
          Address
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

  const renderOrderHistory = () => {
    const dummyOrders = [
      {
        ame: "Paneer",
        date: "01-06-2023",
        total: "₹260",
        status: "Delivered",
      },
      {
        name: "Paneer Pizza",
        date: "09-05-2021",
        total: "₹480",
        status: "Out for Delivery",
      },
      {
        name: "Burger",
        date: "10-08-2025",
        total: "₹80",
        status: "Dispatch",
      },
    ];

    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          Order History
        </h1>

        {isLoggedIn ? (
          dummyOrders.length > 0 ? (
            <div className="space-y-4">
              {dummyOrders.map((order, index) => (
                <div
                  key={index}
                  className="p-4 bg-white border rounded shadow-sm text-gray-800"
                >
                  <p>
                    <strong>Name:</strong> {order.name}
                  </p>
                  <p>
                    <strong>Date:</strong> {order.date}
                  </p>
                  <p>
                    <strong>Total:</strong> {order.total}
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-800">You have no orders yet.</p>
          )
        ) : (
          <p className="text-gray-800">Please log in to view your orders.</p>
        )}
      </div>
    );
  };

  const renderAddress = () => (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">
        Saved Addresses
      </h1>

      {isLoggedIn ? (
        <form
          className="flex flex-col bg-white rounded-lg shadow-md p-6"
          onSubmit={handleSubmitAddress}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Shipping Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="text-gray-800">
              <label>Full Name</label>
              <input
                type="text"
                name="fullname"
                id="fullname"
                required
                value={saveaddress.name}
                onChange={(e) => SetSaveaddress(e.target.value)}
                placeholder="Rahul"
                className="w-full border px-2 py-2 rounded bg-white"
              />
            </div>

            {/* Phone Number */}
            <div className="text-gray-800">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                value={saveaddress.phone}
                onChange={(e) => SetSaveaddress(e.target.value)}
                placeholder="+91 123 456 7890"
                className="w-full border px-2 py-2 rounded bg-white"
              />
            </div>

            {/* House Number */}
            <div className="text-gray-800">
              <label>House No.</label>
              <input
                type="text"
                name="house"
                id="house"
                required
                value={saveaddress.house}
                onChange={(e) => SetSaveaddress(e.target.value)}
                placeholder="03"
                className="w-full border px-2 py-2 rounded bg-white"
              />
            </div>

            {/* Nearby Landmark */}
            <div className="text-gray-800">
              <label>Nearby Landmark / Area</label>
              <input
                type="text"
                name="landmark"
                id="landmark"
                required
                value={saveaddress.landmark}
                onChange={(e) => SetSaveaddress(e.target.value)}
                placeholder="Near Central Jail"
                className="w-full border px-2 py-2 rounded bg-white"
              />
            </div>

            {/* Address Type */}
            <div className="text-gray-800">
              <label>Address Type</label>
              <input
                type="text"
                name="addresstype"
                id="addresstype"
                required
                value={saveaddress.addresstype}
                onChange={(e) => SetSaveaddress(e.target.value)}
                placeholder="Home/Office"
                className="w-full border px-2 py-2 rounded bg-white"
              />
            </div>
            {/* Pincode */}
            <div className="text-gray-800">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                id="pincode"
                required
                value={saveaddress.pincode}
                onChange={(e) => SetSaveaddress(e.target.value)}
                placeholder="123456"
                className="w-full border px-2 py-2 rounded bg-white"
              />
            </div>

            {/* City */}
            <div className="text-gray-800">
              <label>City</label>
              <input
                type="text"
                name="city"
                id="city"
                required
                value={saveaddress.city}
                onChange={(e) => SetSaveaddress(e.target.value)}
                placeholder="Prayagraj"
                className="w-full border px-2 py-2 rounded bg-white"
              />
            </div>

            {/* Country */}
            <div className="text-gray-800">
              <label>Country</label>
              <input
                type="text"
                name="country"
                id="country"
                required
                value={saveaddress.country}
                onChange={(e) => SetSaveaddress(e.target.value)}
                placeholder="India"
                className="w-full border px-2 py-2 rounded bg-white"
              />
            </div>
          </div>
          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Delivery Address
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-800">Please log in to view your addresses.</p>
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

  // ========================= RENDER =========================
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
