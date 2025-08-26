import React from "react";

function Navbar() {
  return (
    <>
      <nav className="flex flex-col lg:flex-row justify-between mx-6 py-3 mb-10">
        <div>
          <h3 className="text-xl font-bold text-gray-600">{new Date().toUTCString().slice(0, 16)}</h3>
          <h1 className="text-2xl font-bold">Foods</h1>
        </div>
        <div>
          <input
            type="search"
            name="search"
            placeholder="Search Here"
                      autoComplete="off"
                      className="p-3 border border-gray-400 text-sm rounded-lg outline-none w-full lg:w-[25vw]"
          />
        </div>
      </nav>
    </>
  );
}

export default Navbar;
