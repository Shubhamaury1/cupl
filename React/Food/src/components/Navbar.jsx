import React from "react";
import { useDispatch } from "react-redux";
import { setSearch } from "../redux/slices/SearchSlice";
import { FaRegUserCircle } from "react-icons/fa";
import Login from "./Login";
import ThemeController from "./ThemeController";
// import Logout from "./Logout";

function Navbar() {
  const dispatch = useDispatch();
  return (
    <>
      <nav className="flex lg:flex-row justify-between mx-10 py-3 mb-10 mt-4 ">
        <div>
          <h3 className="text-xl font-bold text-gray-600 mt-4">
            {new Date().toUTCString().slice(0, 16)}
          </h3>
          <h1 className="text-2xl ">Foods</h1>
        </div>

        <div>
          <input
            type="search"
            name="search"
            id="search"
            placeholder="Search Here"
            autoComplete="off"
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="p-3 border border-gray-400 text-sm rounded-lg outline-none w-full lg:w-[25vw]  mt-4"
          />
        </div>

        <div className=" w-40 h-40">
          <img src="src/assets/chef.png" alt="" />
        </div>

       <ThemeController/>
        <div>
          <FaRegUserCircle
            size={60}
            className="m-8  text-gray-700 cursor-pointer"
            onClick={() => document.getElementById("my_modal_3").showModal()}
          />
          <Login />
          {/* <Logout/> */}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
