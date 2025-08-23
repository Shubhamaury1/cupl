import React from 'react'
import { Link,NavLink } from "react-router-dom";
function Header() {
  
  return (
    <>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/"
              style={({ isActive }) => ({ color: isActive ? "red" : "blue" })}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              style={({ isActive }) => ({ color: isActive ? "red" : "blue" })}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              style={({ isActive }) => ({ color: isActive ? "red" : "blue" })}
            >
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Profile"
              style={({ isActive }) => ({ color: isActive ? "red" : "blue" })}
            >
              Profile
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Header