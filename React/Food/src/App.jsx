import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Success from "./pages/Success";
import Error from "./pages/Error";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import ProtectedRoute from "./components/ProtectedRoute";
import Loginenewpage from "./components/Loginenewpage";
import Address from "./pages/Address";
import OrderDetails from "./pages/OrderDetails";
import ConfirmOrderPage from "./pages/ConfirmOrderPage";
import Admin from "./pages/Admin";
import OrderTrackerStatus from "./components/OrderTrackerStatus";
import AdminOrderDashboard from "./components/AdminOrderDashboard";
import AdminMainPanel from "./components/AdminMainPanel";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/success"
            element={<ProtectedRoute element={<Success />} />}
          />
          <Route path="/orderdetails/:id" element={<OrderDetails />} />
          <Route path="/confirmorderpage" element={<ConfirmOrderPage />} />
          <Route path="/loginenewpage" element={<Loginenewpage />} />
          <Route path="/address" element={<Address />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Error />} />
          <Route path="/ordertrackerstatus" element={<OrderTrackerStatus />} />
          <Route
            path="/adminorderdashboard"
            element={<AdminOrderDashboard />}
          />
          <Route
            path="/adminmainpanel"
            element={<AdminMainPanel />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
