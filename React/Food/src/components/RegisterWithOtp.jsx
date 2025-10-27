import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const APP_URL = import.meta.env.VITE_LOCAL_URL;

export default function RegisterWithOtp() {
  const [step, setStep] = useState("enterEmail"); // enterEmail, enterOtp, done
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  //request otp
  const requestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Enter email");
      return;
    }
    try {
      const res = await axios.post(`${APP_URL}/Authentication/RequestOtp`, {
        email,
      });
      toast.success(res.data.message || "OTP sent to email successfully");
      setStep("enterOtp");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Failed to send OTP");
    }
  };

  //verify otp
  const verifyAndRegister = async (e) => {
    e.preventDefault();
    if (!otp || !name || !password) {
      toast.error("Fill all fields");
      return;
    }
    try {
      const res = await axios.post(
        `${APP_URL}/Authentication/VerifyOtpAndRegister`,
        {
          name,
          email,
          password,
          otp,
        }
      );

      const token = res.data.token || res.data.Token || res.data.Token;
      if (token) {
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        // update your app state if you have setter functions
        toast.success("Registered successfully");
        navigate("/"); // home
      } else {
        toast.success("Registered no token returned");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "OTP verification/registration failed");
    }
  };

  //resend otp
  const resendOtp = async () => {
    try {
      const res = await axios.post(`${APP_URL}/Authentication/RequestOtp`, {
        email,
      });
      toast.success("OTP Resent Your Email");
    } catch (err) {
      toast.error(err.response?.data || "Failed to Resend OTP");
    }
  };
    
    return (
      <div className="flex min-h-screen text-gray-800 ">
        <Toaster position="top-center" reverseOrder={false} />
        {/*Left side */}
        <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-100 p-8 dark:bg-gray-900">
          <div className="w-full max-w-xl rounded-lg shadow-lg shadow-pink-500">
            <h1 className="text-4xl font-bold mb-6 text-pink-500 text-center mt-8">
              AllDayEats
            </h1>
            <h2 className="text-xl font-semibold mb-2 text-center dark:text-pink-400">
              Create Account
            </h2>
            {step === "enterEmail" && (
              <form
                onSubmit={requestOtp}
                className="flex flex-col space-y-6 mt-10 mb-8"
              >
                <div>
                  <label className="dark:text-white">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="abc12@gmail.com"
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition">
                  Send OTP
                </button>
              </form>
            )}
            <p className="text-center text-sm mt-4 text-gray-700 mb-6 dark:text-white">
              Already have an account?{" "}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate("/loginenewpage")}
              >
                Sign In
              </span>
            </p>

            {step === "enterOtp" && (
              <form
                onSubmit={verifyAndRegister}
                className="flex flex-col space-y-6  mb-8"
              >
                <h2 className="text-xl font-semibold mb-2 text-center dark:text-pink-400">
                  Enter OTP & Details
                </h2>
                <div className="flex flex-col">
                  <label className="dark:text-white">
                    OTP (check your email)
                  </label>
                  <input
                    placeholder="123456"
                    className="w-[315px] border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>

                <div>
                  <label className="dark:text-white">Username</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Rahul"
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="dark:text-white">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Rahul123@"
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Verify & Register
                  </button>
                  <button
                    type="button"
                    onClick={resendOtp}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Resend OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("enterEmail")}
                    className="px-4 py-2 bg-red-200 rounded hover:bg-red-300"
                  >
                    Change Email
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right - Image */}
        <div className="hidden md:block md:w-1/2 bg-cover bg-center">
          <img src="src/assets/Order food-pana.png" alt="" />
        </div>
      </div>
    );
}
