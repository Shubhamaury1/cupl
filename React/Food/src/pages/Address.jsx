// import React, { useState, useEffect } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// function Address() {
//   const [selectedAddressIndex, setSelectedAddressIndex] = useState(null); // New state
//   const [isEditing, setIsEditing] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);
//   const cartItems = useSelector((state) => state.cart.cart);

//   // const [saveaddress, setSaveaddress] = useState({
//   //   userName: "",
//   //   phone: "",
//   //   house: "",
//   //   landmark: "",
//   //   addresstype: "",
//   //   pincode: "",
//   //   city: "",
//   //   country: "",
//   // });
//   const [saveaddress, setSaveaddress] = useState({
//     userName: "",
//     phone: "",
//     house: "",
//     landmark: "",
//     addresstype: "",
//     pincode: "",
//     city: "",
//     country: "",
//   });

//   const [addressList, setAddressList] = useState([]);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   // checked saved addresses from localStorage
//   // useEffect(() => {
//   //   const stored = localStorage.getItem("AddNewAddress");
//   //   if (stored) {
//   //     try {
//   //       const parsed = JSON.parse(stored);
//   //       if (Array.isArray(parsed)) {
//   //         setAddressList(parsed);
//   //       }
//   //     } catch (error) {
//   //       console.error("Error parsing stored addresses:", error);
//   //     }
//   //   }
//   // }, []);

//   useEffect(() => {
//     fetch("https://localhost:7076/api/Addresses")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch addresses");
//         }
//         return response.json();
//       })
//       // .then((data) => {
//       //   setAddressList(data);  // <-- update the state to show addresses
//       //   setLoading(false);
//       // })

//       .then((data) => {
//         const normalized = data.map((item) => ({
//           id: item.id,
//           name: item.userName || item.name,
//           phone: item.phone,
//           house: item.houseNumber || item.house,
//           landmark: item.landMark || item.landmark,
//           addresstype: item.addressType || item.addresstype,
//           pincode: item.pinCode || item.pincode,
//           city: item.city,
//           country: item.region || item.country,
//         }));
//         setAddressList(normalized);
//         setLoading(false);
//       })

//       .catch((error) => {
//         setError(error.message);
//         setLoading(false);
//         toast.error("Failed to load addresses from server.");
//       });
//   }, []);

//   // fetch("https://localhost:7076/api/Addresses")
//   //   .then((response) => response.json())
//   //   .then((data) => console.log(data))
//   //   .catch((error) => console.error("Error ", error));

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSaveaddress((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   //   const handleSubmitAddress = (e) => {
//   //     e.preventDefault();

//   //     if (!saveaddress.name || !saveaddress.phone || !saveaddress.pincode) {
//   //       toast.error("Please fill in all required fields!");
//   //       return;
//   //     }

//   //     const newList = [...addressList, saveaddress];
//   //     setAddressList(newList);
//   //     localStorage.setItem("AddNewAddress", JSON.stringify(newList));
//   //     toast.success("New Address added! 🚀");

//   //     // Clear form data
//   //     setSaveaddress("");
//   //   };

//   const handleSubmitAddress = (e) => {
//     e.preventDefault();

//     // if (!saveaddress.name || !saveaddress.phone || !saveaddress.pincode) {
//     //   toast.error("Please fill in all required fields!");
//     //   return;
//     // }
//     // Update existing address
//     if (isEditing && editIndex !== null) {
//       // const updatedList = [...addressList];
//       // updatedList[editIndex] = saveaddress;
//       // setAddressList(updatedList);
//       // localStorage.setItem("AddNewAddress", JSON.stringify(updatedList));
//       // toast.success("Address updated!");
//       // setIsEditing(false);
//       // setEditIndex(null);
//       const updatedAddress = {
//         ...saveaddress,
//         id: addressList[editIndex].id, // Make sure ID is present
//       };
//       const idToUpdate = addressList[editIndex].id;
//       fetch(`https://localhost:7076/api/Addresses/${idToUpdate}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(saveaddress),
//       })
//         .then((res) => {
//           if (!res.ok) throw new Error("Failed to update");
//           return res.json();
//         })
//         .then((updatedAddress) => {
//           const updatedList = [...addressList];
//           updatedList[editIndex] = updatedAddress;
//           setAddressList(updatedList);
//           toast.success("Address updated in DB!");
//           setIsEditing(false);
//           setEditIndex(null);
//         })
//         .catch((error) => {
//           toast.error("Update failed: " + error.message);
//         });
//     } else {
//       // Add new address
//       // const newList = [...addressList, saveaddress];
//       // setAddressList(newList);
//       // localStorage.setItem("AddNewAddress", JSON.stringify(newList));
//       // toast.success("New address added!");

//       fetch("https://localhost:7076/api/Addresses", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(saveaddress),
//       })
//         .then((res) => {
//           if (!res.ok) throw new Error("Failed to add address");
//           return res.json();
//         })
//         .then((newAddress) => {
//           setAddressList((prev) => [...prev, newAddress]);
//           toast.success("Address added to database!");
//         })
//         .catch((error) => {
//           toast.error("Add failed: " + error.message);
//         });
//     }
//     // Reset form
//     // setSaveaddress({
//     //   name: "",
//     //   phone: "",
//     //   house: "",
//     //   landmark: "",
//     //   addresstype: "",
//     //   pincode: "",
//     //   city: "",
//     //   country: "",
//     // });
//     setSaveaddress({
//       userName: addressList[index].userName || addressList[index].name || "",
//       phone: addressList[index].phone || "",
//       house: addressList[index].house || "",
//       landmark: addressList[index].landmark || "",
//       addresstype: addressList[index].addresstype || "",
//       pincode: addressList[index].pincode || "",
//       city: addressList[index].city || "",
//       country: addressList[index].country || "",
//     });
//   };
//   //Edit
//   const handleEdit = (index) => {
//     setSaveaddress(addressList[index]);
//     setIsEditing(true);
//     setEditIndex(index);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };
//   //Delete
//   const handleDelete = (index) => {
//     // const updatedList = addressList.filter((_, idx) => idx !== index);
//     // setAddressList(updatedList);
//     // localStorage.setItem("AddNewAddress", JSON.stringify(updatedList));
//     // toast.success("Address deleted!");
//     const idToDelete = addressList[index].id;

//     fetch(`https://localhost:7076/api/Addresses/${idToDelete}`, {
//       method: "DELETE",
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to delete");
//         const updatedList = addressList.filter((_, idx) => idx !== index);
//         setAddressList(updatedList);
//         toast.success("Address deleted from DB!");
//         if (selectedAddressIndex === index) {
//           setSelectedAddressIndex(null);
//         }
//       })
//       .catch((error) => {
//         toast.error("Delete failed: " + error.message);
//       });

//     if (selectedAddressIndex === index) {
//       setSelectedAddressIndex(null);
//     }
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-green-500">
//         Add New Address
//       </h1>
//       <form
//         className="flex flex-col bg-white rounded-lg shadow-md p-6"
//         onSubmit={handleSubmitAddress}
//       >
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//           Add Address
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Full Name */}
//           <div className="text-gray-800">
//             <label>Full Name</label>
//             <input
//               type="text"
//               name="userName"
//               id="userName"
//               required
//               value={saveaddress.userName || ""}
//               onChange={handleChange}
//               placeholder="Rahul"
//               className="w-full border px-2 py-2 rounded bg-white"
//             />
//           </div>

//           {/* Phone Number */}
//           <div className="text-gray-800">
//             <label>Phone Number</label>
//             <input
//               type="tel"
//               name="phone"
//               id="phone"
//               required
//               value={saveaddress.phone || ""}
//               onChange={handleChange}
//               placeholder="+91 123 456 7890"
//               className="w-full border px-2 py-2 rounded bg-white"
//             />
//           </div>

//           {/* House Number */}
//           <div className="text-gray-800">
//             <label>House No.</label>
//             <input
//               type="text"
//               name="house"
//               id="house"
//               required
//               value={saveaddress.house || ""}
//               onChange={handleChange}
//               placeholder="03"
//               className="w-full border px-2 py-2 rounded bg-white"
//             />
//           </div>

//           {/* Nearby Landmark */}
//           <div className="text-gray-800">
//             <label>Nearby Landmark / Area</label>
//             <input
//               type="text"
//               name="landmark"
//               id="landmark"
//               required
//               value={saveaddress.landmark || ""}
//               onChange={handleChange}
//               placeholder="Near Central Jail"
//               className="w-full border px-2 py-2 rounded bg-white"
//             />
//           </div>

//           {/* Address Type */}
//           <div className="text-gray-800">
//             <label>Address Type</label>
//             <input
//               type="text"
//               name="addresstype"
//               id="addresstype"
//               required
//               value={saveaddress.addresstype || ""}
//               onChange={handleChange}
//               placeholder="Home/Office"
//               className="w-full border px-2 py-2 rounded bg-white"
//             />
//           </div>

//           {/* Pincode */}
//           <div className="text-gray-800">
//             <label>Pincode</label>
//             <input
//               type="text"
//               name="pincode"
//               id="pincode"
//               required
//               value={saveaddress.pincode || ""}
//               onChange={handleChange}
//               placeholder="123456"
//               className="w-full border px-2 py-2 rounded bg-white"
//             />
//           </div>

//           {/* City */}
//           <div className="text-gray-800">
//             <label>City</label>
//             <input
//               type="text"
//               name="city"
//               id="city"
//               required
//               value={saveaddress.city || ""}
//               onChange={handleChange}
//               placeholder="Prayagraj"
//               className="w-full border px-2 py-2 rounded bg-white"
//             />
//           </div>

//           {/* Country */}
//           <div className="text-gray-800">
//             <label>Country</label>
//             <input
//               type="text"
//               name="country"
//               id="country"
//               required
//               value={saveaddress.country || ""}
//               onChange={handleChange}
//               placeholder="India"
//               className="w-full border px-2 py-2 rounded bg-white"
//             />
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="pt-6">
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
//           >
//             Add New
//           </button>
//         </div>
//       </form>

//       <Toaster position="top-center" reverseOrder={false} />
//       {/* Dispaly address*/}
//       <div className="mt-10">
//         <h2 className="text-xl font-bold mb-4 text-gray-800  dark:text-green-500">
//           Saved Addresses
//         </h2>
//         {addressList.length === 0 ? (
//           <p className="text-gray-600">No addresses added yet.</p>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {addressList.map((addr, idx) => (
//               <div
//                 key={idx}
//                 className={`bg-gray-100 p-4 rounded shadow-sm border text-gray-800 ${
//                   selectedAddressIndex === idx
//                     ? "border-green-500 border-2"
//                     : ""
//                 }`}
//               >
//                 <label className="flex items-start space-x-2">
//                   <input
//                     type="radio"
//                     name="selectAddress"
//                     value={idx}
//                     checked={selectedAddressIndex === idx}
//                     onChange={() => setSelectedAddressIndex(idx)}
//                     className="mt-1 appearance-none w-4 h-4 rounded-full border border-gray-400 bg-white checked:bg-white checked:border-black checked:ring-2 checked:ring-black"
//                   />
//                   <div>
//                     <p>
//                       <strong>Name:</strong> {addr.name}
//                     </p>
//                     <p>
//                       <strong>Phone:</strong> {addr.phone}
//                     </p>
//                     <p>
//                       <strong>House:</strong> {addr.house}
//                     </p>
//                     <p>
//                       <strong>Landmark:</strong> {addr.landmark}
//                     </p>
//                     <p>
//                       <strong>Type:</strong> {addr.addresstype}
//                     </p>
//                     <p>
//                       <strong>Pincode:</strong> {addr.pincode}
//                     </p>
//                     <p>
//                       <strong>City:</strong> {addr.city}
//                     </p>
//                     <p>
//                       <strong>Country:</strong> {addr.country}
//                     </p>

//                     <div className="mt-2 flex gap-2">
//                       <button
//                         onClick={() => handleEdit(idx)}
//                         className="text-blue-600 hover:underline text-sm"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(idx)}
//                         className="text-red-600 hover:underline text-sm"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </label>
//               </div>
//             ))}
//           </div>
//         )}
//         {/* <button
//           //   onClick={() => navigate("/success")}
//           onClick={() => {
//             if (selectedAddressIndex === null) {
//               toast.error("Please select address then order");
//               return;
//             }
//             navigate("/success");
//           }}
//           className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition"
//         >
//           Order Placed
//         </button> */}

//         <button
//           onClick={() => {
//             if (selectedAddressIndex === null) {
//               toast.error("Please select address then order");
//               return;
//             }

//             if (cartItems.length === 0) {
//               toast.error("Cart is empty!");
//               return;
//             }

//             const selectedAddress = addressList[selectedAddressIndex];

//             const newOrder = {
//               id: Date.now(),
//               address: selectedAddress,
//               items: cartItems,
//               total: cartItems.reduce(
//                 (total, item) => total + item.price * item.qty,
//                 0
//               ),
//             };
//             //Get existing orders from localStorage
//             const existingOrders =
//               JSON.parse(localStorage.getItem("orderHistory")) || [];

//             //Add new order
//             existingOrders.push(newOrder);
//             //Save update orders
//             localStorage.setItem(
//               "orderHistory",
//               JSON.stringify(existingOrders)
//             );
//             //Save last order separate
//             localStorage.setItem("lastOrder", JSON.stringify(newOrder));

//             navigate("/success");
//           }}
//           className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition"
//         >
//           Order Placed
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Address;

// import React, { useState, useEffect } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// function Address() {
//   const [selectedAddressIndex, setSelectedAddressIndex] = useState(null); // New state
//   const [isEditing, setIsEditing] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);
//   const cartItems = useSelector((state) => state.cart.cart);

//   // const [saveaddress, setSaveaddress] = useState({
//   //   userName: "",
//   //   phone: "",
//   //   house: "",
//   //   landmark: "",
//   //   addresstype: "",
//   //   pincode: "",
//   //   city: "",
//   //   country: "",
//   // });
//   const [saveaddress, setSaveaddress] = useState({
//     userName: "",
//     phone: "",
//     house: "",
//     landmark: "",
//     addresstype: "",
//     pincode: "",
//     city: "",
//     country: "",
//   });

//   const [addressList, setAddressList] = useState([]);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   // checked saved addresses from localStorage
//   // useEffect(() => {
//   //   const stored = localStorage.getItem("AddNewAddress");
//   //   if (stored) {
//   //     try {
//   //       const parsed = JSON.parse(stored);
//   //       if (Array.isArray(parsed)) {
//   //         setAddressList(parsed);
//   //       }
//   //     } catch (error) {
//   //       console.error("Error parsing stored addresses:", error);
//   //     }
//   //   }
//   // }, []);

//   useEffect(() => {
//     fetch("https://localhost:7076/api/Addresses")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch addresses");
//         }
//         return response.json();
//       })
//       // .then((data) => {
//       //   setAddressList(data);  // <-- update the state to show addresses
//       //   setLoading(false);
//       // })

//       .then((data) => {
//         const normalized = data.map((item) => ({
//           id: item.id,
//           name: item.userName || item.name,
//           phone: item.phone,
//           house: item.houseNumber || item.house,
//           landmark: item.landMark || item.landmark,
//           addresstype: item.addressType || item.addresstype,
//           pincode: item.pinCode || item.pincode,
//           city: item.city,
//           country: item.region || item.country,
//         }));
//         setAddressList(normalized);
//         setLoading(false);
//       })

//       .catch((error) => {
//         setError(error.message);
//         setLoading(false);
//         toast.error("Failed to load addresses from server.");
//       });
//   }, []);

//   // fetch("https://localhost:7076/api/Addresses")
//   //   .then((response) => response.json())
//   //   .then((data) => console.log(data))
//   //   .catch((error) => console.error("Error ", error));

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSaveaddress((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   //   const handleSubmitAddress = (e) => {
//   //     e.preventDefault();

//   //     if (!saveaddress.name || !saveaddress.phone || !saveaddress.pincode) {
//   //       toast.error("Please fill in all required fields!");
//   //       return;
//   //     }

//   //     const newList = [...addressList, saveaddress];
//   //     setAddressList(newList);
//   //     localStorage.setItem("AddNewAddress", JSON.stringify(newList));
//   //     toast.success("New Address added! 🚀");

//   //     // Clear form data
//   //     setSaveaddress("");
//   //   };

//   const handleSubmitAddress = (e) => {
//     e.preventDefault();

//     // if (!saveaddress.name || !saveaddress.phone || !saveaddress.pincode) {
//     //   toast.error("Please fill in all required fields!");
//     //   return;
//     // }
//     // Update existing address
//     if (isEditing && editIndex !== null) {
//       // const updatedList = [...addressList];
//       // updatedList[editIndex] = saveaddress;
//       // setAddressList(updatedList);
//       // localStorage.setItem("AddNewAddress", JSON.stringify(updatedList));
//       // toast.success("Address updated!");
//       // setIsEditing(false);
//       // setEditIndex(null);
//       const updatedAddress = {
//         ...saveaddress,
//         id: addressList[editIndex].id, // Make sure ID is present
//       };
//       const idToUpdate = addressList[editIndex].id;
//       fetch(`https://localhost:7076/api/Addresses/${idToUpdate}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(saveaddress),
//       })
//         .then((res) => {
//           if (!res.ok) throw new Error("Failed to update");
//           return res.json();
//         })
//         .then((updatedAddress) => {
//           const updatedList = [...addressList];
//           updatedList[editIndex] = updatedAddress;
//           setAddressList(updatedList);
//           toast.success("Address updated in DB!");
//           setIsEditing(false);
//           setEditIndex(null);
//         })
//         .catch((error) => {
//           toast.error("Update failed: " + error.message);
//         });
//     } else {
//       // Add new address
//       // const newList = [...addressList, saveaddress];
//       // setAddressList(newList);
//       // localStorage.setItem("AddNewAddress", JSON.stringify(newList));
//       // toast.success("New address added!");

//       fetch("https://localhost:7076/api/Addresses", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(saveaddress),
//       })
//         .then((res) => {
//           if (!res.ok) throw new Error("Failed to add address");
//           return res.json();
//         })
//         .then((newAddress) => {
//           setAddressList((prev) => [...prev, newAddress]);
//           toast.success("Address added to database!");
//         })
//         .catch((error) => {
//           toast.error("Add failed: " + error.message);
//         });
//     }
//     // Reset form
//     // setSaveaddress({
//     //   name: "",
//     //   phone: "",
//     //   house: "",
//     //   landmark: "",
//     //   addresstype: "",
//     //   pincode: "",
//     //   city: "",
//     //   country: "",
//     // });
//     setSaveaddress({
//       userName: addressList[index].userName || addressList[index].name || "",
//       phone: addressList[index].phone || "",
//       house: addressList[index].house || "",
//       landmark: addressList[index].landmark || "",
//       addresstype: addressList[index].addresstype || "",
//       pincode: addressList[index].pincode || "",
//       city: addressList[index].city || "",
//       country: addressList[index].country || "",
//     });
//   };
//   //Edit
//   const handleEdit = (index) => {
//     setSaveaddress(addressList[index]);
//     setIsEditing(true);
//     setEditIndex(index);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };
//   //Delete
//   const handleDelete = (index) => {
//     // const updatedList = addressList.filter((_, idx) => idx !== index);
//     // setAddressList(updatedList);
//     // localStorage.setItem("AddNewAddress", JSON.stringify(updatedList));
//     // toast.success("Address deleted!");
//     const idToDelete = addressList[index].id;

//     fetch(`https://localhost:7076/api/Addresses/${idToDelete}`, {
//       method: "DELETE",
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to delete");
//         const updatedList = addressList.filter((_, idx) => idx !== index);
//         setAddressList(updatedList);
//         toast.success("Address deleted from DB!");
//         if (selectedAddressIndex === index) {
//           setSelectedAddressIndex(null);
//         }
//       })
//       .catch((error) => {
//         toast.error("Delete failed: " + error.message);
//       });

//     if (selectedAddressIndex === index) {
//       setSelectedAddressIndex(null);
//     }
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-green-500">
//         Add New Address
//       </h1>
//       <form
//         className="flex flex-col bg-white rounded-lg shadow-md p-6"
//         onSubmit={handleSubmitAddress}
//       >
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//           Add Address
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Full Name */}
//           <div className="text-gray-800">
//             <label>Full Name</label>
//             <input
//               type="text"
//               name="userName"
//               id="userName"
//               required
//               value={saveaddress.userName || ""}
//               onChange={handleChange}
//               placeholder="Rahul"
//               className="w-full border px-2 py-2 rounded bg-white"
//             />
//           </div>

//           {/* Phone Number */}
//           <div className="text-gray-800">
//             <label>Phone Number</label>
//             <input
//               type="tel"
//               name="phone"
//               id="phone"
//               required
//               value={saveaddress.phone || ""}
//               onChange={handleChange}
//               placeholder="+91 123 456 7890"
//               className="w-full border px-2 py-2 rounded bg-white"
//             />
//           </div>

//           {/* House Number */}
//           <div className="text-gray-800">
//             <label>House No.</label>
//             <input
//               type="text"
//               name="house"
//               id="house"
//               required
//               value={saveaddress.house || ""}
//               onChange={handleChange}
//               placeholder="03"
//               className="w-full border px-2 py-2 rounded bg-white"
//             />
//           </div>

//           {/* Nearby Landmark */}
//           <div className="text-gray-800">
//             <label>Nearby Landmark / Area</label>
//             <input
//               type="text"
//               name="landmark"
//               id="landmark"
//               required
//               value={saveaddress.landmark || ""}
//               onChange={handleChange}
//               placeholder="Near Central Jail"
//               className="w-full border px-2 py-2 rounded bg-white"
//             />
//           </div>

//           {/* Address Type */}
//           <div className="text-gray-800">
//             <label>Address Type</label>
//             <input
//               type="text"
//               name="addresstype"
//               id="addresstype"
//               required
//               value={saveaddress.addresstype || ""}
//               onChange={handleChange}
//               placeholder="Home/Office"
//               className="w-full border px-2 py-2 rounded bg-white"
//             />
//           </div>

//           {/* Pincode */}
//           <div className="text-gray-800">
//             <label>Pincode</label>
//             <input
//               type="text"
//               name="pincode"
//               id="pincode"
//               required
//               value={saveaddress.pincode || ""}
//               onChange={handleChange}
//               placeholder="123456"
//               className="w-full border px-2 py-2 rounded bg-white"
//             />
//           </div>

//           {/* City */}
//           <div className="text-gray-800">
//             <label>City</label>
//             <input
//               type="text"
//               name="city"
//               id="city"
//               required
//               value={saveaddress.city || ""}
//               onChange={handleChange}
//               placeholder="Prayagraj"
//               className="w-full border px-2 py-2 rounded bg-white"
//             />
//           </div>

//           {/* Country */}
//           <div className="text-gray-800">
//             <label>Country</label>
//             <input
//               type="text"
//               name="country"
//               id="country"
//               required
//               value={saveaddress.country || ""}
//               onChange={handleChange}
//               placeholder="India"
//               className="w-full border px-2 py-2 rounded bg-white"
//             />
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="pt-6">
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
//           >
//             Add New
//           </button>
//         </div>
//       </form>

//       <Toaster position="top-center" reverseOrder={false} />
//       {/* Dispaly address*/}
//       <div className="mt-10">
//         <h2 className="text-xl font-bold mb-4 text-gray-800  dark:text-green-500">
//           Saved Addresses
//         </h2>
//         {addressList.length === 0 ? (
//           <p className="text-gray-600">No addresses added yet.</p>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {addressList.map((addr, idx) => (
//               <div
//                 key={idx}
//                 className={`bg-gray-100 p-4 rounded shadow-sm border text-gray-800 ${
//                   selectedAddressIndex === idx
//                     ? "border-green-500 border-2"
//                     : ""
//                 }`}
//               >
//                 <label className="flex items-start space-x-2">
//                   <input
//                     type="radio"
//                     name="selectAddress"
//                     value={idx}
//                     checked={selectedAddressIndex === idx}
//                     onChange={() => setSelectedAddressIndex(idx)}
//                     className="mt-1 appearance-none w-4 h-4 rounded-full border border-gray-400 bg-white checked:bg-white checked:border-black checked:ring-2 checked:ring-black"
//                   />
//                   <div>
//                     <p>
//                       <strong>Name:</strong> {addr.name}
//                     </p>
//                     <p>
//                       <strong>Phone:</strong> {addr.phone}
//                     </p>
//                     <p>
//                       <strong>House:</strong> {addr.house}
//                     </p>
//                     <p>
//                       <strong>Landmark:</strong> {addr.landmark}
//                     </p>
//                     <p>
//                       <strong>Type:</strong> {addr.addresstype}
//                     </p>
//                     <p>
//                       <strong>Pincode:</strong> {addr.pincode}
//                     </p>
//                     <p>
//                       <strong>City:</strong> {addr.city}
//                     </p>
//                     <p>
//                       <strong>Country:</strong> {addr.country}
//                     </p>

//                     <div className="mt-2 flex gap-2">
//                       <button
//                         onClick={() => handleEdit(idx)}
//                         className="text-blue-600 hover:underline text-sm"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(idx)}
//                         className="text-red-600 hover:underline text-sm"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </label>
//               </div>
//             ))}
//           </div>
//         )}
//         {/* <button
//           //   onClick={() => navigate("/success")}
//           onClick={() => {
//             if (selectedAddressIndex === null) {
//               toast.error("Please select address then order");
//               return;
//             }
//             navigate("/success");
//           }}
//           className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition"
//         >
//           Order Placed
//         </button> */}

//         <button
//           onClick={() => {
//             if (selectedAddressIndex === null) {
//               toast.error("Please select address then order");
//               return;
//             }

//             if (cartItems.length === 0) {
//               toast.error("Cart is empty!");
//               return;
//             }

//             const selectedAddress = addressList[selectedAddressIndex];

//             const newOrder = {
//               id: Date.now(),
//               address: selectedAddress,
//               items: cartItems,
//               total: cartItems.reduce(
//                 (total, item) => total + item.price * item.qty,
//                 0
//               ),
//             };
//             //Get existing orders from localStorage
//             const existingOrders =
//               JSON.parse(localStorage.getItem("orderHistory")) || [];

//             //Add new order
//             existingOrders.push(newOrder);
//             //Save update orders
//             localStorage.setItem(
//               "orderHistory",
//               JSON.stringify(existingOrders)
//             );
//             //Save last order separate
//             localStorage.setItem("lastOrder", JSON.stringify(newOrder));

//             navigate("/success");
//           }}
//           className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition"
//         >
//           Order Placed
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Address;

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Address() {
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [addressList, setAddressList] = useState([]);
  const [loading, setLoading] = useState(true);

  const cartItems = useSelector((state) => state.cart.cart);
  const navigate = useNavigate();

  const [saveaddress, setSaveaddress] = useState({
    userName: "",
    phone: "",
    house: "",
    landmark: "",
    addresstype: "",
    pincode: "",
    city: "",
    country: "",
  });

  // Fetch all addresses from backend
  useEffect(() => {
    fetch("https://localhost:7076/api/Addresses")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch addresses");
        return response.json();
      })
      .then((data) => {
        const normalized = data.map((item) => ({
          id: item.id,
          userName: item.userName || item.name || "",
          phone: item.phone || "",
          house: item.houseNumber || item.house || "",
          landmark: item.landMark || item.landmark || "",
          addresstype: item.addressType || item.addresstype || "",
          pincode: item.pinCode || item.pincode || "",
          city: item.city || "",
          country: item.region || item.country || "",
        }));
        setAddressList(normalized);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Failed to load addresses");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSaveaddress((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setSaveaddress({
      userName: "",
      phone: "",
      house: "",
      landmark: "",
      addresstype: "",
      pincode: "",
      city: "",
      country: "",
    });
    setIsEditing(false);
    setEditIndex(null);
  };
  const mapToApiAddress = (addr, id = null) => ({
    ...(id !== null && { id }),
    uid: 1, // replace with user ID if available
    addressType: addr.addresstype,
    userName: addr.userName,
    houseNumber: addr.house,
    locality: addr.landmark,
    city: addr.city,
    region: addr.country,
    pinCode: addr.pincode,
    country: addr.country?.substring(0, 3).toUpperCase() || "IN",
    phone: addr.phone,
    landMark: addr.landmark,
  });

  const handleSubmitAddress = (e) => {
    e.preventDefault();

    if (
      !saveaddress.userName ||
      !saveaddress.phone ||
      !saveaddress.pincode ||
      !saveaddress.city
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    if (isEditing && editIndex !== null) {
      const idToUpdate = addressList[editIndex].id;
      fetch(`https://localhost:7076/api/Addresses/${idToUpdate}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapToApiAddress(saveaddress, idToUpdate)),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Update failed");
          return res.json();
        })
        .then((updatedAddress) => {
          const updatedList = [...addressList];
          updatedList[editIndex] = updatedAddress;
          setAddressList(updatedList);
          toast.success("Address updated!");
          resetForm();
        })
        .catch((err) => toast.error("Update failed: " + err.message));
    } else {
      console.log("hello");
      fetch("https://localhost:7076/api/Addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapToApiAddress(saveaddress)),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Add failed");
          return res.json();
        })
        .then((newAddress) => {
          setAddressList((prev) => [...prev, newAddress]);
          toast.success("Address added!");
          resetForm();
        })
        .catch((err) => toast.error("Add failed: " + err.message));
    }
  };

  const handleEdit = (index) => {
    const selected = addressList[index];
    setSaveaddress({ ...selected });
    setIsEditing(true);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (index) => {
    const idToDelete = addressList[index].id;
    fetch(`https://localhost:7076/api/Addresses/${idToDelete}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        const updatedList = addressList.filter((_, i) => i !== index);
        setAddressList(updatedList);
        toast.success("Address deleted!");
        if (selectedAddressIndex === index) {
          setSelectedAddressIndex(null);
        }
      })
      .catch((err) => toast.error("Delete failed: " + err.message));
  };

  const handlePlaceOrder = () => {
    if (selectedAddressIndex === null) {
      toast.error("Please select an address");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Cart is empty!");
      return;
    }

    const selectedAddress = addressList[selectedAddressIndex];

    const newOrder = {
      id: Date.now(),
      address: selectedAddress,
      items: cartItems,
      total: cartItems.reduce(
        (total, item) => total + item.price * item.qty,
        0
      ),
    };

    const existingOrders =
      JSON.parse(localStorage.getItem("orderHistory")) || [];
    existingOrders.push(newOrder);
    localStorage.setItem("orderHistory", JSON.stringify(existingOrders));
    localStorage.setItem("lastOrder", JSON.stringify(newOrder));
    navigate("/success");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-green-500">
        {isEditing ? "Edit Address" : "Add New Address"}
      </h1>

      <form
        className="flex flex-col bg-white rounded-lg shadow-md p-6"
        onSubmit={handleSubmitAddress}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Full Name", name: "userName", placeholder: "Rahul" },
            { label: "Phone", name: "phone", placeholder: "+91 1234567890" },
            { label: "House", name: "house", placeholder: "123" },
            {
              label: "Landmark",
              name: "landmark",
              placeholder: "Near Central Park",
            },
            {
              label: "Address Type",
              name: "addresstype",
              placeholder: "Home/Office",
            },
            { label: "Pincode", name: "pincode", placeholder: "110001" },
            { label: "City", name: "city", placeholder: "Delhi" },
            { label: "Country", name: "country", placeholder: "India" },
          ].map((field) => (
            <div className="text-gray-800" key={field.name}>
              <label>{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={saveaddress[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full border px-2 py-2 rounded bg-white"
                required
              />
            </div>
          ))}
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            {isEditing ? "Update Address" : "Add Address"}
          </button>
        </div>
      </form>

      <Toaster position="top-center" reverseOrder={false} />

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-green-500">
          Saved Addresses
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : addressList.length === 0 ? (
          <p>No addresses added yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addressList.map((addr, idx) => (
              <div
                key={addr.id}
                className={`bg-gray-100 p-4 rounded shadow-sm border text-gray-800 ${
                  selectedAddressIndex === idx
                    ? "border-green-500 border-2"
                    : ""
                }`}
              >
                <label className="flex items-start space-x-2">
                  <input
                    type="radio"
                    name="selectAddress"
                    value={idx}
                    checked={selectedAddressIndex === idx}
                    onChange={() => setSelectedAddressIndex(idx)}
                    className="mt-1 appearance-none w-4 h-4 rounded-full border border-gray-400 bg-white checked:bg-white checked:border-black checked:ring-2 checked:ring-black"
                  />
                  <div>
                    <p>
                      <strong>Name:</strong> {addr.userName}
                    </p>
                    <p>
                      <strong>Phone:</strong> {addr.phone}
                    </p>
                    <p>
                      <strong>House:</strong> {addr.house}
                    </p>
                    <p>
                      <strong>Landmark:</strong> {addr.landmark}
                    </p>
                    <p>
                      <strong>Type:</strong> {addr.addresstype}
                    </p>
                    <p>
                      <strong>Pincode:</strong> {addr.pincode}
                    </p>
                    <p>
                      <strong>City:</strong> {addr.city}
                    </p>
                    <p>
                      <strong>Country:</strong> {addr.country}
                    </p>

                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(idx)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(idx)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handlePlaceOrder}
          className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition"
        >
          Order Placed
        </button>
      </div>
    </div>
  );
}

export default Address;
