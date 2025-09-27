import React, { useEffect, useState } from "react";
import FoodCard from "./FoodCard";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function FoodItems() {
  const [foods, setFoods] = useState([]);
  const selectedCategory = useSelector((state) => state.category.category);
  const search = useSelector((state) => state.search.search);
  const loggedInUserId = 1;

// start 
  //Pagination Logic for frontend
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // it can only changed according to frontend

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          // `https://localhost:7076/api/FileUpload/all?pageNumber=${currentPage}&pageSize=${itemsPerPage}`
          `https://localhost:7076/api/FileUpload/all`,
          {
            params: {
              pageNumber: currentPage,
              pageSize: itemsPerPage,
              searchTerm: search,
              category: selectedCategory === "All" ? null : selectedCategory,
            },
          }
        );
        if (response.status === 200) {
          //console.log("received data are", response.data);
          // console.log("Params being sent to API", {
          //   currentPage,
          //   itemsPerPage,
          //   search,
          //   selectedCategory,
          // });
         

          const data = response.data;
          setFoods(data.items || []);
          setTotalPages(data.totalPages);
          setTotalItems(data.totalItems);
        } else {
          console.log("Data does not received");
        }
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage, search, selectedCategory]);

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
    // Manage button 
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
              ? "bg-gray-600 text-white dark:bg-orange-400 dark:font-bold"
              : "bg-gray-400 hover:bg-gray-300 dark:bg-orange-300 "
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };
  // end paginations


  const addhandleToast = (name) => toast.success(`Added ${name} to cart`);

  //Apply both Category and Search filter
  // const filteredFoods = foods.filter((food) => {
  //   const matchCategory =
  //     selectedCategory === "All" || food.category === selectedCategory;
  //   const matchSearch = food.name.toLowerCase().includes(search.toLowerCase());
  //   return matchCategory && matchSearch;
  // });

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-wrap gap-12 justify-center lg:justify-start mx-10 my-10">
        {foods.length > 0 ? (
          foods.map((item) => (
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
            className="px-3 py-1 mx-1 rounded bg-gray-400 hover:bg-gray-500 disabled:opacity-50 dark:bg-orange-400 "
          >
            Previous
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 mx-1 rounded bg-gray-400 hover:bg-gray-500 disabled:opacity-50 dark:bg-orange-400"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default FoodItems;


