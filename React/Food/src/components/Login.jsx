import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  

  // const handleForm = (e) => {
  //   e.preventDefault();
  //   alert(`Username: ${username}\nPassword: ${password}`);
  //   setUsername("")
  //   setPassword("")
  // }

  const handleForm = (e) => {
    e.preventDefault();
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");

    if (username != storedUsername && password != storedPassword) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      toast.success(`Data Save In Local Storage`);
    } else {
      toast.error("Data Already Exit in Local Storage ");
    }
    // Clear input fields
    setUsername("");
    setPassword("");
  };
  return (
    <>
      <dialog id="my_modal_3" className="modal rounded-xl">
        <div className="modal-box ">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className=" text-xl absolute right-4 top-2 p-2 text-red-400 hover:text-red-600">
              ✕
            </button>
          </form>
          <h2 className="font-bold text-lg text-center mt-4  ">Login</h2>
          <div className="login-container">
            <label htmlFor="userName">UserName</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter User Name"
              required
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />
            <br />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter Your Password"
              required
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <br />
            <button onClick={handleForm}>Login</button>
             <Toaster position="top-center" reverseOrder={false} />
          </div>
        </div>
      </dialog>
    </>
  );
}

export default Login;
