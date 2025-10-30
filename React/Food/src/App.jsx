import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Success from "./pages/Success";
import Error from "./pages/Error";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import ProtectedRoute from "./components/ProtectedRoute";
import Loginenewpage from "./components/Loginenewpage";
import OrderDetails from "./pages/OrderDetails";
import ConfirmOrderPage from "./pages/ConfirmOrderPage";
import Admin from "./pages/Admin";
import RegisterWithOtp from "./components/RegisterWithOtp";
import ForgotPassword from "./components/ForgotPassword";


function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/success"
            element={<ProtectedRoute element={<Success />} />}
          />
          <Route path="/orderdetails/:id" element={<OrderDetails />} />
          <Route path="/confirmorderpage" element={<ConfirmOrderPage />} />
          <Route path="/loginenewpage" element={<Loginenewpage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/registerwithotp" element={<RegisterWithOtp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </HashRouter>
    </>
  );
}
export default App;
