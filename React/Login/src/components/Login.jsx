// import React, { useState } from "react";

// function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [login, setLogin] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (username === "abc" && password === "123") {
//       setLogin(true);
//       alert(`Username: ${username}\nPassword: ${password}`);
//     } else {
//       setLogin(false);
//       alert("Wrong Creditional");
//     }
//     setPassword("");
//     setUsername("");
//   };
//   const togglePassword = (e) => {
//     e.preventDefault();
//     setShowPassword(!showPassword);
//   };
//   return (
//     <>
//       <div className="body">
//         <div className="login-container">
//           <h2>Login</h2>

//           <htmlForm onSubmit={handleSubmit}>
//             <label htmlFor="username">UserName</label>
//             <input
//               type="text"
//               name="username"
//               id="username"
//               value={username}
//               placeholder="Enter User Name"
//               required
//               onChange={(e) => {
//                 setUsername(e.target.value);
//               }}
//             />

//             <label htmlFor="password">Password</label>
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               id="password"
//               value={password}
//               placeholder="Enter Your Password"
//               required
//               onChange={(e) => setPassword(e.target.value)}
//             />

//             <button onClick={togglePassword}>
//               {showPassword ? "Hide" : "Show"}
//             </button>

//             <button type="submit">Login</button>
//           </htmlForm>
//           {login ? <h1>Loggin</h1> : null}
//         </div>
//       </div>
//     </>
//   );
// }

// export default Login;

import React, { useState } from "react";
import { useEffect } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const SavedUsername = localStorage.getItem("username");
    const SavedPassword = localStorage.getItem("password");

    if (SavedUsername) setUsername(SavedUsername);
    if (SavedPassword) setPassword(SavedPassword);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Data Stored in local Storage
    //localStorage.setItem("username", username);
    //localStorage.setItem("password", password);

    //Alert show in the Browser
    //alert(`Data Save\nUsername: ${username}\nPassword: ${password}`);

    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");

    if (username != storedUsername && password != storedPassword) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      alert(`Data Save In Local Storage`);
    } else {
      alert("Data Already Exit in Local Storage ");
    }
    // Clear input fields
    setUsername("");
    setPassword("");
  };

  const togglePassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="body">
      <div className="login-container">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">UserName</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            placeholder="Enter User Name"
            required
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />

          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={password}
            placeholder="Enter Your Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={togglePassword}>
            {showPassword ? "Hide" : "Show"}
          </button>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
