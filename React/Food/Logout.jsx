import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
function Logout() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleForm = (e) => {
    e.preventDefault();
    alert(`Username: ${username}\nPassword: ${password}`);
    setUsername("");
    setPassword("");
  };

  return (
    <>
      <dialog id="my_modal_4" className="modal rounded-xl">
        <div className="modal-box ">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className=" text-xl absolute right-4 top-2 p-2 text-red-400 hover:text-red-600">
              ✕
            </button>
          </form>
          <h2 className="font-bold text-lg text-center mt-4  ">SignUp</h2>
          <div className="login-container">
            <label htmlFor="userName">UserName</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter User Name"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Your Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter Your Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleForm}>Login</button>
            <Toaster position="top-center" reverseOrder={false} />
          </div>
        </div>
      </dialog>
    </>
  );
}

export default Logout;
