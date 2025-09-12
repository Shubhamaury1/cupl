import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Address() {
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(null); // New state
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
const cartItems = useSelector((state) => state.cart.cart);

  const [saveaddress, setSaveaddress] = useState({
    name: "",
    phone: "",
    house: "",
    landmark: "",
    addresstype: "",
    pincode: "",
    city: "",
    country: "",
  });

  const [addressList, setAddressList] = useState([]);
  const navigate = useNavigate();
  // checked saved addresses from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("AddNewAddress");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setAddressList(parsed);
        }
      } catch (error) {
        console.error("Error parsing stored addresses:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSaveaddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

//   const handleSubmitAddress = (e) => {
//     e.preventDefault();

//     if (!saveaddress.name || !saveaddress.phone || !saveaddress.pincode) {
//       toast.error("Please fill in all required fields!");
//       return;
//     }

//     const newList = [...addressList, saveaddress];
//     setAddressList(newList);
//     localStorage.setItem("AddNewAddress", JSON.stringify(newList));
//     toast.success("New Address added! 🚀");

//     // Clear form data
//     setSaveaddress("");
//   };

    
    const handleSubmitAddress = (e) => {
      e.preventDefault();

      if (!saveaddress.name || !saveaddress.phone || !saveaddress.pincode) {
        toast.error("Please fill in all required fields!");
        return;
      }
      // Update existing address
      if (isEditing && editIndex !== null) {
        const updatedList = [...addressList];
        updatedList[editIndex] = saveaddress;
        setAddressList(updatedList);
        localStorage.setItem("AddNewAddress", JSON.stringify(updatedList));
        toast.success("Address updated!");
        setIsEditing(false);
        setEditIndex(null);
      } else {
        // Add new address
        const newList = [...addressList, saveaddress];
        setAddressList(newList);
        localStorage.setItem("AddNewAddress", JSON.stringify(newList));
        toast.success("New address added!");
      }
      // Reset form
        setSaveaddress({
          name: "",
          phone: "",
          house: "",
          landmark: "",
          addresstype: "",
          pincode: "",
          city: "",
          country: "",
        });
    };
        //Edit
    const handleEdit = (index) => {
      setSaveaddress(addressList[index]);
      setIsEditing(true);
      setEditIndex(index);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
        //Delete
    const handleDelete = (index) => {
      const updatedList = addressList.filter((_, idx) => idx !== index);
      setAddressList(updatedList);
      localStorage.setItem("AddNewAddress", JSON.stringify(updatedList));
      toast.success("Address deleted!");
      if (selectedAddressIndex === index) {
        setSelectedAddressIndex(null);
      }
    };

    
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">
        Add New Address
      </h1>
      <form
        className="flex flex-col bg-white rounded-lg shadow-md p-6"
        onSubmit={handleSubmitAddress}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Add Address
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="text-gray-800">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              id="fullname"
              required
              value={saveaddress.name}
              onChange={handleChange}
              placeholder="Rahul"
              className="w-full border px-2 py-2 rounded bg-white"
            />
          </div>

          {/* Phone Number */}
          <div className="text-gray-800">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              value={saveaddress.phone}
              onChange={handleChange}
              placeholder="+91 123 456 7890"
              className="w-full border px-2 py-2 rounded bg-white"
            />
          </div>

          {/* House Number */}
          <div className="text-gray-800">
            <label>House No.</label>
            <input
              type="text"
              name="house"
              id="house"
              required
              value={saveaddress.house}
              onChange={handleChange}
              placeholder="03"
              className="w-full border px-2 py-2 rounded bg-white"
            />
          </div>

          {/* Nearby Landmark */}
          <div className="text-gray-800">
            <label>Nearby Landmark / Area</label>
            <input
              type="text"
              name="landmark"
              id="landmark"
              required
              value={saveaddress.landmark}
              onChange={handleChange}
              placeholder="Near Central Jail"
              className="w-full border px-2 py-2 rounded bg-white"
            />
          </div>

          {/* Address Type */}
          <div className="text-gray-800">
            <label>Address Type</label>
            <input
              type="text"
              name="addresstype"
              id="addresstype"
              required
              value={saveaddress.addresstype}
              onChange={handleChange}
              placeholder="Home/Office"
              className="w-full border px-2 py-2 rounded bg-white"
            />
          </div>

          {/* Pincode */}
          <div className="text-gray-800">
            <label>Pincode</label>
            <input
              type="text"
              name="pincode"
              id="pincode"
              required
              value={saveaddress.pincode}
              onChange={handleChange}
              placeholder="123456"
              className="w-full border px-2 py-2 rounded bg-white"
            />
          </div>

          {/* City */}
          <div className="text-gray-800">
            <label>City</label>
            <input
              type="text"
              name="city"
              id="city"
              required
              value={saveaddress.city}
              onChange={handleChange}
              placeholder="Prayagraj"
              className="w-full border px-2 py-2 rounded bg-white"
            />
          </div>

          {/* Country */}
          <div className="text-gray-800">
            <label>Country</label>
            <input
              type="text"
              name="country"
              id="country"
              required
              value={saveaddress.country}
              onChange={handleChange}
              placeholder="India"
              className="w-full border px-2 py-2 rounded bg-white"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Add New
          </button>
        </div>
      </form>

      <Toaster position="top-center" reverseOrder={false} />
      {/* Dispaly address*/}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Saved Addresses
        </h2>
        {addressList.length === 0 ? (
          <p className="text-gray-600">No addresses added yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addressList.map((addr, idx) => (
              <div
                key={idx}
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
                      <strong>Name:</strong> {addr.name}
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
        {/* <button
          //   onClick={() => navigate("/success")}
          onClick={() => {
            if (selectedAddressIndex === null) {
              toast.error("Please select address then order");
              return;
            }
            navigate("/success");
          }}
          className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition"
        >
          Order Placed
        </button> */}

        {/* <button
          onClick={() => {
            if (selectedAddressIndex === null) {
              toast.error("Please select address then order");
              return;
            }

            // Sample cart items (replace with actual cart logic)
            const cartItems = [
              { name: "T-shirt", quantity: 2, price: 500 },
              { name: "Shoes", quantity: 1, price: 1200 },
            ];
            const selectedAddress = addressList[selectedAddressIndex];
            const order = {
              id: Date.now(), // unique order ID
              address: selectedAddress,
              items: cartItems,
              total: cartItems.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              ),
            };
            localStorage.setItem("lastOrder", JSON.stringify(order));
            navigate("/order");
          }}
          className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition"
        >
          Order Placed
        </button> */}

        <button
          onClick={() => {
            if (selectedAddressIndex === null) {
              toast.error("Please select address then order");
              return;
            }

            if (cartItems.length === 0) {
              toast.error("Cart is empty!");
              return;
            }

            const selectedAddress = addressList[selectedAddressIndex];

            const order = {
              id: Date.now(),
              address: selectedAddress,
              items: cartItems,
              total: cartItems.reduce(
                (total, item) => total + item.price * item.qty,
                0
              ),
            };

            localStorage.setItem("lastOrder", JSON.stringify(order));
            navigate("/order");
          }}
          className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition"
        >
          Order Placed
        </button>
      </div>
    </div>
  );
}

export default Address;
