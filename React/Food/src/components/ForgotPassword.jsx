// import React ,{useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import {useNavigate } from "react-router-dom";
// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_FORGOT_PASSWORD_URL;

// function ForgotPassword() {
//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${BASE_URL}/ForgotPasswordRequestOtp`, { email });
//       toast.success("OTP sent to your email!");
//       setStep(2);
//     } catch (err) {
//       toast.error(err.response?.data || "Failed to send OTP");
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${BASE_URL}/VerifyForgotPasswordOtp`, { email, otp });
//       toast.success("OTP verified!");
//       setStep(3);
//     } catch (err) {
//       toast.error(err.response?.data || "Invalid OTP");
//     }
//   };

//     const handleResetPassword = async (e) => {
//       e.preventDefault();
//       try {
//         await axios.post(`${BASE_URL}/ResetPassword`, {
//           email,
//           newPassword,
//           confirmPassword,
//         });
//         toast.success("Password reset successful!");
//         navigate("/loginenewpage");
//         setNewPassword("");
//         setConfirmPassword("");
//       } catch (err) {
//         toast.error(err.response?.data || "Error resetting password");
//       }
//     };

//   return (
//     <>
//       <div className="flex min-h-screen text-gray-800 ">
//         <Toaster position="top-center" reverseOrder={false} />
//         {/*Left side */}
//         <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-100 p-8 dark:bg-gray-900">
//           <div className="w-full max-w-xl rounded-lg shadow-lg shadow-pink-500">
//             <h1 className="text-4xl font-bold mb-6 text-pink-500 text-center mt-8">
//               AllDayEats
//             </h1>
//             <h2 className="text-xl font-semibold mb-2 text-center dark:text-pink-400">
//               Forgot Password
//             </h2>

//             {step === 1 && (
//               <form
//                 onSubmit={handleSendOtp}
//                 className="flex flex-col space-y-6 mt-10 mb-8"
//               >
//                 <div>
//                   <label className="dark:text-white">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="Enter Your Register Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
//                   />
//                 </div>
//                 <button className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition">
//                   Send OTP
//                 </button>
//               </form>
//             )}


//             <p className="text-center text-sm mt-4 text-gray-700 mb-6 dark:text-white">
//               Already have an account?{" "}
//               <span
//                 className="text-blue-600 hover:underline cursor-pointer"
//                 onClick={() => navigate("/loginenewpage")}
//               >
//                 Sign In
//               </span>
//             </p>


//             {step === 2 && (
//               <form
//                 onSubmit={handleVerifyOtp}
//                 className="flex flex-col space-y-6 mt-10 mb-8"
//               >
//                 <p className="text-lg text-gray-600 dark:text-white">
//                   OTP sent to <b>{email}</b>
//                 </p>
//                 <input
//                   type="text"
//                   placeholder="Enter OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   className=" border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
//                   required
//                 />
//                 <button className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition">
//                   Verify OTP
//                 </button>
//               </form>
//             )}

//             {step === 3 && (
//               <form
//                 onSubmit={handleResetPassword}
//                 className="flex flex-col space-y-6 mt-10 mb-8"
//               >
//                 <input
//                   type="password"
//                   placeholder="New Password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   className=" border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
//                   required
//                 />
//                 <input
//                   type="password"
//                   placeholder="Confirm Password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className=" border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
//                   required
//                 />
//                 <button className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition">
//                   Reset Password
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>

//         {/* Right - Image */}
//         <div className="hidden md:block md:w-1/2 bg-cover bg-center">
//           <img src="src/assets/Order food-pana.png" alt="" />
//         </div>
//       </div>

//       {/* Right - Image */}
//     </>
//   );
// }

// export default ForgotPassword;





import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import loginimage from "../assets/Order food-pana.png";

const BASE_URL = import.meta.env.VITE_FORGOT_PASSWORD_URL;

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // for button disabling
  const [resendTimer, setResendTimer] = useState(0); // countdown timer
  const navigate = useNavigate();

  // Helper function to start resend timer (e.g. 60 seconds)
  const startResendTimer = (seconds) => {
    setResendTimer(seconds);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // STEP 1 - Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/ForgotPasswordRequestOtp`, { email });
      toast.success("OTP sent to your email!");
      setStep(2);
      startResendTimer(60); // start 60s timer before allowing resend
    } catch (err) {
      toast.error(err.response?.data || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 - Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/VerifyForgotPasswordOtp`, { email, otp });
      toast.success("OTP verified!");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data || "Invalid OTP");
    }
  };

  // STEP 3 - Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/ResetPassword`, {
        email,
        newPassword,
        confirmPassword,
      });
      toast.success("Password reset successful!");
      navigate("/loginenewpage");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data || "Error resetting password");
    }
  };

  return (
    <>
      <div className="flex min-h-screen text-gray-800 ">
        <Toaster position="top-center" reverseOrder={false} />

        {/* Left side */}
        <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-100 p-8 dark:bg-gray-900">
          <div className="w-full max-w-xl rounded-lg shadow-lg shadow-pink-500">
            <h1 className="text-4xl font-bold mb-6 text-pink-500 text-center mt-8">
              AllDayEats
            </h1>
            <h2 className="text-xl font-semibold mb-2 text-center dark:text-pink-400">
              Forgot Password
            </h2>

            {/* STEP 1 */}
            {step === 1 && (
              <form
                onSubmit={handleSendOtp}
                className="flex flex-col space-y-6 mt-10 mb-8"
              >
                <div>
                  <label className="dark:text-white">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || resendTimer > 0}
                  className={`px-4 py-2 rounded text-white transition ${
                    loading || resendTimer > 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-pink-500 hover:bg-pink-600"
                  }`}
                >
                  {loading
                    ? "Sending..."
                    : resendTimer > 0
                    ? `Resend OTP (${resendTimer}s)`
                    : "Send OTP"}
                </button>
              </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <form
                onSubmit={handleVerifyOtp}
                className="flex flex-col space-y-6 mt-10 mb-8"
              >
                <p className="text-lg text-gray-600 dark:text-white">
                  OTP sent to <b>{email}</b>
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                  required
                />
                <button className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition">
                  Verify OTP
                </button>

                {resendTimer === 0 && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </form>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <form
                onSubmit={handleResetPassword}
                className="flex flex-col space-y-6 mt-10 mb-8"
              >
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                  required
                />
                <button className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition">
                  Reset Password
                </button>
              </form>
            )}

            {/* Link */}
            <p className="text-center text-sm mt-4 text-gray-700 mb-6 dark:text-white">
              Already have an account?{" "}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate("/loginenewpage")}
              >
                Sign In
              </span>
            </p>
          </div>
        </div>

        {/* Right side image */}
        <div className="hidden md:block md:w-1/2 bg-cover bg-center">
          {/* <img src="src/assets/Order food-pana.png" alt="Forgot password" /> */}
          <img src={loginimage} />
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
