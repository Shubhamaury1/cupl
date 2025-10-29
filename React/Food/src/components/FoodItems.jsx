
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

  // Reset page to 1 whenever filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, search]);

  // Fetch Best Sellers
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await axios.get(`${APP_URL}/OrdersControllers/bestseller`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.status === 200) {
          setBestSellerFoods(res.data);
        }
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      }
    };
    fetchBestSellers();
  }, []);

  // Fetch All Food Items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${APP_URL}/FileUpload/User/all`, {
          params: {
            pageNumber: 1,
            pageSize: 100,
            searchTerm: search || null,
            category: selectedCategory === "All" ? null : selectedCategory,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          const data = response.data;
          const activeItems = (data.items || []).filter(
            (item) => item.isactive === true
          );

          const isFiltering =
            (search && search.trim() !== "") ||
            (selectedCategory && selectedCategory !== "All");

          if (isFiltering) {
            // Pagination for filtered items
            const totalItemsCount = activeItems.length;
            const totalPagesCalc = Math.ceil(totalItemsCount / itemsPerPage);
            const pagedItems = activeItems.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            );

            setFoods(pagedItems);
            setTotalItems(totalItemsCount);
            setTotalPages(totalPagesCalc);
            return;
          }

          // Merge Best Sellers + Regular Products for default view
          const bestSellerIds = bestSellerFood.map((item) => item.pId);

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

          const nonBestSellers = activeItems
            .filter((item) => !bestSellerIds.includes(item.id))
            .map((item) => ({ ...item, isBestSeller: false }));

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
            const combined = [...bestSellers, ...nonBestSellers];
            finalList = combined.slice(0, itemsPerPage);
          } else {
            const offset =
              (currentPage - 2) * itemsPerPage +
              (itemsPerPage - bestSellers.length);
            finalList = nonBestSellers.slice(offset, offset + itemsPerPage);
          }

          setFoods(finalList);
          setTotalItems(totalItemsCount);
          setTotalPages(totalPagesCalc);
        }
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, search, selectedCategory, bestSellerFood]);

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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
              : "bg-gray-400 hover:bg-gray-300 dark:bg-orange-300"
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
              userId={loggedInUserId}
              stock={item.totalProductQuantity}
              isBestSeller={item.isBestSeller}
            />
          ))
        ) : (
          <p className="text-gray-600 text-lg">No products found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center my-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 mx-1 rounded bg-gray-400 hover:bg-gray-500 disabled:opacity-50 dark:bg-orange-400"
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
