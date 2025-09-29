import React, { useEffect, useState } from "react";
import axios from "axios";
const APP_URL = import.meta.env.VITE_LOCAL_URL;
import toast, { Toaster } from "react-hot-toast";

function Admin() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    category: "",
    rating: "",
    file: null,
  });

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${APP_URL}/FileUpload/all`, {
          params: {
            pageNumber: currentPage,
            pageSize: itemsPerPage,
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
  }, [currentPage, itemsPerPage]);

  const handlePageSizeChange = (e) => {
    const value = e.target.value;
    if (value === "All") {
      setItemsPerPage(totalItems || 100);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("id", formData.id);
    fd.append("name", formData.name);
    fd.append("price", formData.price);
    fd.append("description", formData.description);
    fd.append("category", formData.category);
    fd.append("rating", formData.rating);
    if (formData.file) {
      fd.append("file", formData.file);
    }

    try {
      let postResponse;
      if (formData.id) {
        // If id exists, this is an update
        postResponse = await axios.put(
          `${APP_URL}/FileUpload/${formData.id}`,
          fd
        );
        // console.log("Edit",postResponse.data)
      } else {
        // If no id, this is a create
        postResponse = await axios.post(`${APP_URL}/FileUpload/`, fd, {});
      }

      if (postResponse.status === 200) {
        const created = postResponse.data;
        if (formData.id) {
          setProducts((prev) =>
            prev.map((p) => (p.id === formData.id ? created : p))
          );
          toast.success("✅ Product updated successfully!");
        } else {
          setProducts((prev) => [...prev, created]);
          toast.success("✅ Product added successfully!");
        }
        setFormData({
          id: "",
          name: "",
          price: "",
          description: "",
          category: "",
          rating: "",
          file: null,
        });
      } else {
        console.error("Failed to save product:", postResponse.status);
        toast.error("Error saving product.");
      }
    } catch (err) {
      console.error("Error posting product:", err);
      toast.error("Error saving product.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const response = await axios.delete(`${APP_URL}/FileUpload/delete/${id}`);
      if (response.status === 200) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Product deleted successfully!");
      } else {
        toast.error("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product.");
    }
  };

  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      rating: product.rating,
      file: null, // You can't edit the file through the form, so leave it as null
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* ===================== FORM SECTION ===================== */}
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          📦 Admin Product Upload
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
                step={field.step || undefined}
                min={field.min || undefined}
                max={field.max || undefined}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full border px-2 py-2 rounded bg-white dark:shadow-md text-gray-800"
              />
            </div>
          ))}

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
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 text-center">
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {formData.id ? "✏️ Update Product" : "➕ Submit Product"}
            </button>
          </div>
        </form>
      </div>

      {/* ===================== TABLE SECTION ===================== */}
      {products.length > 0 ? (
        <div className="mt-12 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">
            📋 Product List
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="py-3 px-4 border-b">S.No</th>
                  <th className="py-3 px-4 border-b">Image</th>
                  <th className="py-3 px-4 border-b">Name</th>
                  <th className="py-3 px-4 border-b">Price</th>
                  <th className="py-3 px-4 border-b">Category</th>
                  <th className="py-3 px-4 border-b">Rating</th>
                  <th className="py-3 px-4 border-b max-w-xs">Description</th>
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
                      key={product.id}
                      className="hover:bg-gray-50 text-gray-800"
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
                      <td className="py-2 px-4 border-b space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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

                {totalPages > 1 && (
                  <div className="flex justify-center items-center my-4">
                    <label htmlFor="pagesize" className="text-gray-800 ml-8">
                      Page Size:
                    </label>
                    <select
                      id="pagesize"
                      className="bg-white text-gray-800 ml-1 border border-gray-800 rounded"
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
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-8 text-center text-gray-600">
          No products to display.
        </p>
      )}
      <Toaster />
    </div>
  );
}

export default Admin;

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   const fd = new FormData();
//   fd.append("id", formData.id);
//   fd.append("name", formData.name);
//   fd.append("price", formData.price);
//   fd.append("description", formData.description);
//   fd.append("category", formData.category);
//   fd.append("rating", formData.rating);
//   if (formData.file) {
//     fd.append("file", formData.file);
//   }

//   try {
//     let postResponse;
//     if (formData.id) {
//       // If id exists, this is an update
//       postResponse = await axios.put(
//         `${APP_URL}/FileUpload/${formData.id}`,
//         fd
//       );
//     } else {
//       // If no id, this is a create
//       postResponse = await axios.post(`${APP_URL}/FileUpload/`, fd);
//     }

//     if (postResponse.status === 200) {
//       const created = postResponse.data;

//       // Log to ensure the response is what you expect
//       console.log("Created Product:", created);

//       if (formData.id) {
//         setProducts((prev) =>
//           prev.map((p) => (p.id === formData.id ? created : p))
//         );
//         toast.success("✅ Product updated successfully!");
//       } else {
//         setProducts((prev) => [...prev, created]);
//         toast.success("✅ Product added successfully!");
//       }

//       // Reset form data
//       setFormData({
//         id: "",
//         name: "",
//         price: "",
//         description: "",
//         category: "",
//         rating: "",
//         file: null,
//       });
//     } else {
//       console.error("Failed to save product:", postResponse.status);
//       toast.error("Error saving product.");
//     }
//   } catch (err) {
//     console.error("Error posting product:", err);
//     toast.error("Error saving product.");
//   }
// };
