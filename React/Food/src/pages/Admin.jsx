import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import OrderTrackerStatus from "../components/OrderTrackerStatus";
import AdminOrderDashboard from "../components/AdminOrderDashboard";
import AdminChatBox from "../components/AdminChatBox";
import AdminMainPanel from "../components/AdminMainPanel";
import { useNavigate, Link } from "react-router-dom";
import AdminOrUser from "../components/AdminOrUser";
import { jwtDecode } from "jwt-decode";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import AdminFileUploades from "../components/AdminFileUploades";


// function App() {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const navigate = useNavigate();

//   // In your Admin page component
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const decode = jwtDecode(token);
//     const isAdmin = decode.isAdmin === "True" || decode.isAdmin === true;
//     if (!isAdmin) {
//       toast.error("Access denied");
//       navigate("/"); // redirect to home
//     }
//   }, []);

//   const renderContent = () => {
//     switch (activeTab) {
//       case "admin":
//         return <Admin />;
//       case "file-upload":
//         return <FileUpload />;
//       case "order-tracker":
//         return <OrderTracker />;
//       case "dashboard":
//         return <Dashboard />;
//       case "chat-dashboard":
//         return <ChatDashboard />;
//       default:
//         return <Dashboard />;
//     }
//   };

//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
//         <Link to="/">
//           <h2 className="text-xl font-semibold text-center mb-6 mt-6">
//             Admin Panel
//           </h2>
//         </Link>

//         <ul>
//           <li
//             className="cursor-pointer p-3 hover:bg-gray-700 rounded mb-2"
//             onClick={() => setActiveTab("admin")}
//           >
//             Admin
//           </li>
//           <li
//             className="cursor-pointer p-3 hover:bg-gray-700 rounded mb-2"
//             onClick={() => setActiveTab("dashboard")}
//           >
//             Dashboard
//           </li>
//           <li
//             className="cursor-pointer p-3 hover:bg-gray-700 rounded mb-2"
//             onClick={() => setActiveTab("order-tracker")}
//           >
//             Order Tracker
//           </li>
//           <li
//             className="cursor-pointer p-3 hover:bg-gray-700 rounded mb-2"
//             onClick={() => setActiveTab("file-upload")}
//           >
//             File Upload
//           </li>

//           <li
//             className="cursor-pointer p-3 hover:bg-gray-700 rounded mb-2"
//             onClick={() => setActiveTab("chat-dashboard")}
//           >
//             Chat Dashboard
//           </li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-8">{renderContent()}</div>
//     </div>
//   );
// }

// Admin Section

function App() {
  // Load activeTab from localStorage (or default to "dashboard")
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "dashboard";
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    const isAdmin = decode.isAdmin === "True" || decode.isAdmin === true;
    if (!isAdmin) {
      toast.error("Access denied");
      navigate("/"); // redirect to home
    }
  }, []);

  // Whenever activeTab changes, save it to localStorage
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "admin":
        return <Admin />;
      case "file-upload":
        return <FileUpload />;
      case "order-tracker":
        return <OrderTracker />;
      case "dashboard":
        return <Dashboard />;
      case "chat-dashboard":
        return <ChatDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
        <Link to="/" className="flex items-center ">
          <IoArrowBackCircleOutline className="text-3xl mr-2" />
          <h2 className="text-xl font-semibold text-center mb-6 mt-6">
            Admin Panel
          </h2>
        </Link>

        <ul>
          {[
            { key: "admin", label: "Admin" },
            { key: "dashboard", label: "Dashboard" },
            { key: "order-tracker", label: "Order Tracker" },
            { key: "file-upload", label: "File Upload" },
            { key: "chat-dashboard", label: "Chat Dashboard" },
          ].map((item) => (
            <li
              key={item.key}
              className={`cursor-pointer p-3 rounded mb-2 ${
                activeTab === item.key
                  ? "bg-gray-700 font-bold"
                  : "hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
}

const Admin = () => (
  <div className="text-gray-800 bg-white">
    <AdminMainPanel></AdminMainPanel>
    <AdminOrUser></AdminOrUser>
  </div>
);

// Order Tracker Section
const OrderTracker = () => (
  <div className="text-gray-800">
    <OrderTrackerStatus></OrderTrackerStatus>
  </div>
);

// Dashboard Section
const Dashboard = () => (
  <div className="text-gray-800">
    <AdminOrderDashboard></AdminOrderDashboard>
  </div>
);

//File Upload section
const FileUpload = () => (
  <div className=" mt-10 text-gray-800">
    <AdminFileUploades></AdminFileUploades>
  </div>
);

// Chatbox Section
const ChatDashboard = () => (
  <div className=" mt-10 text-gray-800">
    <AdminChatBox></AdminChatBox>
  </div>
);

export default App;
