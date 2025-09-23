// import React, { useEffect, useState } from "react";
// import FoodCard from "./FoodCard";
// import { useSelector } from "react-redux";
// import toast, { Toaster } from "react-hot-toast";
// import axios from "axios";
// function FoodItems() {
//   const [foods, setFoods] = useState([]);
//   const selectedCategory = useSelector((state) => state.category.category);
//   const search = useSelector((state) => state.search.search);
//  const loggedInUserId = 1;
//   useEffect(() => {
//     axios
//       .get("https://localhost:7076/api/FileUpload/all")
//       .then((res) => setFoods(res.data))
//       .catch((err) => console.error("Error fetching food items:", err));
//   }, []);

//   const addhandleToast = (name) => toast.success(`Added ${name} to cart`);

//   //Apply both Category and Search filter
//   const filteredFoods = foods.filter((food) => {
//     const matchCategory =
//       selectedCategory === "All" || food.category === selectedCategory;
//     const matchSearch = food.name.toLowerCase().includes(search.toLowerCase());
//     return matchCategory && matchSearch;
//   });

//   return (
//     <>
//       <Toaster position="top-center" reverseOrder={false} />
//       <div className="flex flex-wrap gap-12 justify-center lg:justify-start mx-10 my-10">
//         {filteredFoods.length > 0 ? (
//           filteredFoods.map((item) => (
//             <FoodCard
//               key={item.id}
//               id={item.id}
//               name={item.name}
//               price={item.price}
//               desc={item.description}
//               rating={item.rating}
//               img={item.imageUrl}
//               handleToast={addhandleToast}
//               userId={loggedInUserId}
//             />
//           ))
//         ) : (
//           <p className="text-gray-600 text-lg">No food items found.</p>
//         )}
//       </div>
//     </>
//   );
// }

// export default FoodItems;



import React, { useEffect, useState } from "react";
import FoodCard from "./FoodCard";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function FoodItems() {
  const [foods, setFoods] = useState([]); // array of current page items
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const selectedCategory = useSelector((state) => state.category.category);
  const search = useSelector((state) => state.search.search);
  const loggedInUserId = 1;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch foods from backend for current page
  useEffect(() => {
    axios
      .get(
        `https://localhost:7076/api/FileUpload/all?pageNumber=${currentPage}&pageSize=${itemsPerPage}`
      )
      .then((res) => {
        const data = res.data;
        setFoods(data.items || []);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
      })
      .catch((err) => console.error("Error fetching food items:", err));
  }, [currentPage]);

  const addhandleToast = (name) => toast.success(`Added ${name} to cart`);

  // Filter foods locally based on category and search (optional)
  // You can also push filtering to backend for better performance if dataset is big
  const filteredFoods = foods.filter((food) => {
    const matchCategory =
      selectedCategory === "All" || food.category === selectedCategory;
    const matchSearch = food.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Render pagination buttons (same as before)
  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + 4);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - 4);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-wrap gap-12 justify-center lg:justify-start mx-10 my-10">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((item) => (
            <FoodCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              desc={item.description}
              rating={item.rating}
              img={item.imageUrl}
              handleToast={addhandleToast}
              userId={loggedInUserId}
            />
          ))
        ) : (
          <p className="text-gray-600 text-lg">No food items found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center my-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default FoodItems;

