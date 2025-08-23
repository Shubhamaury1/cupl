import React from "react";

function Logout() {
  return (
    <>
      <div className="body">
        <div className="login-container">
          <h2>LogOut</h2>

          <htmlForm>
            <label htmlFor="username">UserName</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter User Name"
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter The Email "
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter Your Password"
              required
            />

            <button type="submit">Login</button>
          </htmlForm>
        </div>
      </div>
    </>
  );
}

export default Logout;
