
import React, { useEffect, useState } from "react";
import FoodCard from "./FoodCard";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const APP_URL = import.meta.env.VITE_LOCAL_URL;

function FoodItems() {
  const [foods, setFoods] = useState([]);
  const [bestSellerFood, setBestSellerFoods] = useState([]);
  const selectedCategory = useSelector((state) => state.category.category);
  const search = useSelector((state) => state.search.search);
  const loggedInUserId = 1;

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch Best Sellers 
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await axios.get(`${APP_URL}/OrdersControllers/bestseller`);
        if (res.status === 200) {
          setBestSellerFoods(res.data);
        }
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      }
    };
    fetchBestSellers();
  }, []);

  // Fetch food items and merge a/c to best seller
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${APP_URL}/FileUpload/User/all`, {
          params: {
            pageNumber: 1,
            pageSize: 100, // Fetch all page
            searchTerm: search,
            category: selectedCategory === "All" ? null : selectedCategory,
          },
        });

        if (response.status === 200) {
          const data = response.data;

          const activeItems = (data.items || []).filter(
            (item) => item.isactive === true
          );

          const bestSellerIds = bestSellerFood.map((item) => item.pId);

          // Format best sellers
          const bestSellers = bestSellerFood.map((item) => ({
            id: item.pId,
            name: item.productName,
            price: item.productPrice,
            description: item.description,
            rating: item.rating,
            imageUrl: item.imageUrl,
            totalProductQuantity: item.totalProductQuantity,
            isBestSeller: true,
          }));

          // Remove best sellers from active items
          const nonBestSellers = activeItems
            .filter((item) => !bestSellerIds.includes(item.id))
            .map((item) => ({
              ...item,
              isBestSeller: false,
            }));

          // Calculate total items and total pages
          const totalItemsCount = bestSellers.length + nonBestSellers.length;
          const remainingAfterFirstPage = Math.max(
            0,
            nonBestSellers.length - (itemsPerPage - bestSellers.length)
          );
          const totalPagesCalc =
            totalItemsCount <= itemsPerPage
              ? 1
              : 1 + Math.ceil(remainingAfterFirstPage / itemsPerPage);

          let finalList = [];

          if (currentPage === 1) {
            // Page 1:- In these page we show Best sellers + non-best selller
            const combined = [...bestSellers, ...nonBestSellers];
            finalList = combined.slice(0, itemsPerPage);
          } else {
            // Page > 1:- Only non-best sellers show in the next page
            const offset =
              (currentPage - 2) * itemsPerPage +
              (itemsPerPage - bestSellers.length);
            finalList = nonBestSellers.slice(offset, offset + itemsPerPage);
          }

          setFoods(finalList);
          setTotalItems(totalItemsCount);
          setTotalPages(totalPagesCalc);
        } else {
          console.log("Failed to fetch food items");
        }
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, search, selectedCategory, bestSellerFood]);

  // Handle pagination button click
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Render page buttons
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

  const addhandleToast = (name) => toast.success(`Added ${name} to cart`);

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
              stock={item.totalProductQuantity}
              isBestSeller={item.isBestSeller}
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
