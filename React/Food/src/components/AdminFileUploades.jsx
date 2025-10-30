import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { setSearch } from "../redux/slices/SearchSlice";

const APP_URL = import.meta.env.VITE_LOCAL_URL;
const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;

const AdminFileUploades = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    category: "",
    rating: "",
    totalProductQuantity: "",
    isactive: "",
    file: null,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  // Redux selectors
  const selectedCategory = useSelector((state) => state.category.category);
  const search = useSelector((state) => state.search.search);

  const dispatch = useDispatch();

  // ================= Handle Input Change =================
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // ================= Toggle Description =================
  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ================= Fetch Products =================
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${APP_URL}/FileUpload/all`, {
          params: {
            pageNumber: currentPage,
            pageSize: itemsPerPage,
            searchTerm: search,
            category: selectedCategory === "All" ? null : selectedCategory,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.status === 200) {
          const data = response.data;
          setProducts(data.items || []);
          setTotalPages(data.totalPages);
          setTotalItems(data.totalItems);
        } else {
          console.error("Failed to fetch products, status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getData();
  }, [currentPage, itemsPerPage, search, selectedCategory]);

  // ================= Handle Page Change =================
  const handlePageSizeChange = (e) => {
    const value = e.target.value;
    if (value === "All") {
      setItemsPerPage(totalItems);
      setCurrentPage(1);
    } else {
      const newSize = parseInt(value, 10);
      setItemsPerPage(newSize);
      setCurrentPage(1);
    }
  };

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
              ? "bg-gray-600 text-white dark:bg-blue-500 dark:font-bold"
              : "bg-gray-400 hover:bg-gray-300 dark:bg-blue-400"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  // ================= Handle Submit =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("id", formData.id);
    fd.append("name", formData.name);
    fd.append("price", formData.price);
    fd.append("description", formData.description);
    fd.append("category", formData.category);
    fd.append("totalProductQuantity", formData.totalProductQuantity);
    fd.append("isactive", formData.isactive);
    fd.append("rating", formData.rating);
    if (formData.file) {
      fd.append("file", formData.file);
    }

    try {
      let postResponse;
      if (formData.id) {
        postResponse = await axios.put(
          `${APP_URL}/FileUpload/${formData.id}`,
          fd,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        postResponse = await axios.post(`${APP_URL}/FileUpload/`, fd, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      if (postResponse.status === 200) {
        const updatedProduct = postResponse.data;

        if (formData.id) {
          setProducts((prev) =>
            prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
          );
          toast.success("Product updated successfully!");
        } else {
          setProducts((prev) => [updatedProduct, ...prev]);
          toast.success("Product added successfully!");
        }

        // reset form
        setFormData({
          id: "",
          name: "",
          price: "",
          description: "",
          category: "",
          rating: "",
          totalProductQuantity: "",
          isactive: "",
          file: null,
        });
      } else {
        toast.error("Error saving product.");
      }
    } catch (err) {
      console.error("Error posting product:", err);
      toast.error("Error saving product.");
    }
  };

  // ================= Handle Search =================
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearch(query));
  };

  // ================= Handle Edit =================
  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      rating: product.rating,
      totalProductQuantity: product.totalProductQuantity,
      isactive: product.isactive,
      file: null,
    });
  };

  // ================= Render UI =================
  return (
    <>
      <div className="">
        <div className="bg-white p-8 rounded-xl shadow-md dark:bg-blue-200">
          <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
            📦 Admin Product Upload
          </h2>

          {/* FORM SECTION */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            {[
              { label: "Name", name: "name", type: "text", required: true },
              {
                label: "Price (₹)",
                name: "price",
                type: "number",
                required: true,
                min: 0,
              },
              {
                label: "Category",
                name: "category",
                type: "text",
                required: true,
              },
              {
                label: "Rating",
                name: "rating",
                type: "number",
                step: "0.1",
                min: 0,
                max: 5,
              },
              {
                label: "TotalProductQuantity",
                name: "totalProductQuantity",
                type: "number",
                required: true,
                min: 0,
              },
            ].map((field) => (
              <div key={field.name}>
                <label className="block mb-1 font-medium text-gray-700">
                  {field.label}
                  {field.required && " *"}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  step={field.step}
                  min={field.min}
                  max={field.max}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full border px-2 py-2 rounded bg-white dark:shadow-md text-gray-800"
                />
              </div>
            ))}

            {/* Active Status */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Active
              </label>
              <select
                name="isactive"
                id="isactive"
                value={formData.isactive}
                onChange={handleChange}
                className="w-full border px-2 py-2 rounded bg-white dark:shadow-md text-gray-800"
              >
                <option value="">-- Select --</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="w-full border px-2 py-2 rounded bg-white dark:shadow-md text-gray-800"
              />
            </div>

            {/* File Upload */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium text-gray-700">
                Product Image *
              </label>
              <input
                type="file"
                name="file"
                accept="image/*"
                onChange={handleChange}
                className="block text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 text-center">
              <button
                type="submit"
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {formData.id ? "Update Product" : "Submit Product"}
              </button>
            </div>
          </form>
        </div>

        {/* ===================== TABLE SECTION ===================== */}
        {products.length > 0 ? (
          <div className="mt-12 bg-white p-6 rounded-xl shadow-md dark:bg-blue-200">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-4 gap-4">
              <h3 className="text-xl font-semibold mb-4 text-blue-700">
                📋 Product List
              </h3>
              <form
                onSubmit={handleSearch}
                className="relative w-full lg:w-[25vw]"
              >
                <input
                  type="search"
                  name="search"
                  id="search"
                  placeholder="Search Here"
                  autoComplete="off"
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 text-sm rounded-full border border-gray-300 outline-none bg-white text-gray-900 dark:bg-orange-200 dark:text-black dark:bg-white"
                />
                <button
                  type="submit"
                  className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center justify-center w-12 h-11 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition shadow-md outline-none dark:bg-blue-400"
                >
                  <FaSearch />
                </button>
              </form>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border border-gray-200">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs dark:bg-blue-300">
                  <tr>
                    <th className="py-3 px-4 border-b">S.No</th>
                    <th className="py-3 px-4 border-b">Image</th>
                    <th className="py-3 px-4 border-b">Name</th>
                    <th className="py-3 px-4 border-b">Price</th>
                    <th className="py-3 px-4 border-b">Category</th>
                    <th className="py-3 px-4 border-b">Total Quantity</th>
                    <th className="py-3 px-4 border-b">Rating</th>
                    <th className="py-3 px-4 border-b max-w-xs">Description</th>
                    <th className="py-3 px-4 border-b">Active</th>
                    <th className="py-3 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, idx) => {
                    const isExpanded = expandedDescriptions[product.id];
                    const desc = product.description || "";
                    const shouldTruncate = desc.length > 20;
                    const displayDesc = isExpanded ? desc : desc.slice(0, 20);

                    return (
                      <tr
                        key={product.id || idx}
                        className="hover:bg-gray-50 text-gray-800 dark:hover:bg-blue-300"
                      >
                        <td className="py-2 px-4 border-b text-gray-800">
                          {(currentPage - 1) * itemsPerPage + (idx + 1)}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {product.filePreview ? (
                            <img
                              src={product.filePreview}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-2 px-4 border-b text-gray-800">
                          {product.name}
                        </td>
                        <td className="py-2 px-4 border-b text-gray-800">
                          ₹{product.price}
                        </td>
                        <td className="py-2 px-4 border-b text-gray-800">
                          {product.category}
                        </td>
                        <td className="py-2 px-4 border-b text-gray-800">
                          {product.totalProductQuantity}
                        </td>
                        <td className="py-2 px-4 border-b text-gray-800">
                          {product.rating ?? "N/A"}
                        </td>
                        <td className="py-2 px-4 border-b max-w-xs">
                          <span>{displayDesc}</span>
                          {shouldTruncate && (
                            <button
                              onClick={() => toggleDescription(product.id)}
                              className="ml-2 text-blue-500 font-bold hover:underline text-xs"
                            >
                              {isExpanded ? "Show Less" : "...Show More"}
                            </button>
                          )}
                        </td>
                        <td className="py-2 px-4 border-b text-gray-800">
                          {product.isactive === "true" ||
                          product.isactive === true
                            ? "Active"
                            : "Inactive"}
                        </td>
                        <td className="py-2 px-4 border-b space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-4 my-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 mx-1 rounded bg-gray-400 hover:bg-gray-500 disabled:opacity-50 dark:bg-blue-500"
                  >
                    Previous
                  </button>

                  {renderPageNumbers()}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 mx-1 rounded bg-gray-400 hover:bg-gray-500 disabled:opacity-50 dark:bg-blue-500"
                  >
                    Next
                  </button>

                  <div className="flex justify-center items-center my-4">
                    <label htmlFor="pagesize" className="text-gray-800 ml-8">
                      Page Size:
                    </label>
                    <select
                      id="pagesize"
                      className="bg-white text-gray-800 ml-1 border border-gray-800 rounded dark:bg-blue-300"
                      value={itemsPerPage === totalItems ? "All" : itemsPerPage}
                      onChange={handlePageSizeChange}
                    >
                      <option value="All">All</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                    </select>
                  </div>

                  <label className="text-gray-800 ml-5">
                    Total Items: {totalItems}
                  </label>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-8 text-center text-gray-600">No product Found.</p>
        )}
        <Toaster />
      </div>
    </>
  );
};

export default AdminFileUploades;
