import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function Address() {
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [addressList, setAddressList] = useState([]);
  const [loading, setLoading] = useState(true);
  //const cartItems = useSelector((state) => state.cart.cart);
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

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7076/api/Addresses"
        );
        const data = response.data;

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
      } catch (error) {
        toast.error("Failed to load addresses");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
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
    uid: 1, // Replace with dynamic user ID if needed
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

  const handleSubmitAddress = async (e) => {
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

    try {
      if (isEditing && editIndex !== null) {
        const idToUpdate = addressList[editIndex].id;

        const response = await axios.put(
          `https://localhost:7076/api/Addresses/${idToUpdate}`,
          mapToApiAddress(saveaddress, idToUpdate)
        );

        const updatedAddress = {
          ...saveaddress,
          id: response.data.id,
        };

        const updatedList = [...addressList];
        updatedList[editIndex] = updatedAddress;
        setAddressList(updatedList);
        toast.success("Address updated!");
      } else {
        const response = await axios.post(
          "https://localhost:7076/api/Addresses",
          mapToApiAddress(saveaddress)
        );

        setAddressList((prev) => [
          ...prev,
          {
            ...saveaddress,
            id: response.data.id,
          },
        ]);
        toast.success("Address added!");
      }

      resetForm();
    } catch (error) {
      toast.error(`Operation failed: ${error.message}`);
    }
  };

  const handleEdit = (index) => {
    const selected = addressList[index];
    setSaveaddress({ ...selected });
    setIsEditing(true);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (index) => {
    const idToDelete = addressList[index].id;

    try {
      await axios.delete(`https://localhost:7076/api/Addresses/${idToDelete}`);
      const updatedList = addressList.filter((_, i) => i !== index);
      setAddressList(updatedList);
      toast.success("Address deleted!");

      if (selectedAddressIndex === index) {
        setSelectedAddressIndex(null);
      }
    } catch (error) {
      toast.error("Delete failed: " + error.message);
    }
  };

  return (
    <div className="p-8 h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-green-500">
        {isEditing ? "Edit Address" : "Add New Address"}
      </h1>

      <form
        className="flex flex-col bg-white rounded-xl shadow-md p-6 dark:bg-blue-200 dark:shadow-blue-700"
        onSubmit={handleSubmitAddress}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
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
              <label className="dark:text-blue-700">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={saveaddress[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full border px-2 py-2 rounded bg-white rounded-xl dark:shadow-md"
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
                className={`bg-gray-100 p-4 rounded shadow-sm border text-gray-800 dark:bg-orange-200 ${
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

        {/* <button
          onClick={handlePlaceOrder}
          className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition"
        >
          Place Order
        </button> */}
      </div>
    </div>
  );
}

export default Address;
