import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setSearch } from "../redux/slices/SearchSlice";
import { FaRegUserCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import ThemeController from "./ThemeController";
import { FaSearch } from "react-icons/fa";
import chef from "../assets/chef.png"

function Navbar() {
  const dispatch = useDispatch();

  const [query, setQuery] = useState("");

  // Every click search
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    dispatch(setSearch(value)); // instantly trigger search
  };

  // still handle manual submit
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearch(query));
  };

  return (
    <>
      <nav className="flex flex-col lg:flex-row md:flex-col sm:flex-col justify-between mx-10 py-3 mb-10">
        {/* Left side - logo/date */}
        <div>
          <h3 className="text-xl font-bold text-gray-600 mt-4 dark:text-orange-300 mt-8">
            {new Date().toUTCString().slice(0, 16)}
          </h3>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-orange-300 ">
            AllDayEats
          </h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full lg:w-[25vw]">
          <input
            type="search"
            name="search"
            id="search"
            placeholder="Search Here"
            autoComplete="off"
            value={query}
            onChange={handleInputChange} // live update here
            className="w-full pr-12 pl-4 py-3 text-sm rounded-full border border-gray-300 outline-none bg-white text-gray-900 dark:bg-orange-200 dark:text-black"
          />
          <button
            type="submit"
            className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center justify-center w-12 h-11 rounded-full bg-green-500 text-white hover:bg-green-600 transition shadow-md outline-none dark:bg-blue-400"
          >
            <FaSearch />
          </button>
        </form>

      
        <div className="w-40 h-40">
          <img src={chef} alt="Chef" />
        </div>

        {/* Theme toggle & user icon */}
        <ThemeController />
        <div>
          <NavLink to="/loginenewpage">
            <FaRegUserCircle
              size={60}
              className="m-8 text-gray-700 cursor-pointer dark:text-orange-300 mr-12"
            />
          </NavLink>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
