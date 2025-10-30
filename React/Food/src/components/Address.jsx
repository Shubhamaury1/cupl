import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
const APP_URL = import.meta.env.VITE_LOCAL_URL;
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function Address() {
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [addressList, setAddressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

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

  // Fetch user addresses on load
  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("User not authenticated.");
        setLoading(false);
        return;
      }

      const decode = jwtDecode(token);
      const userid = decode.userid;

      try {
        const response = await axios.get(`${APP_URL}/Addresses/${userid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const normalized = response.data.map((item) => ({
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

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent non-numeric input for phone & pincode
    if (name === "phone" && value && !/^\d*$/.test(value)) return;
    if (name === "pincode" && value && !/^\d*$/.test(value)) return;

    setSaveaddress((prev) => ({ ...prev, [name]: value }));
  };

  // Validate all fields before submission
  const validate = () => {
    let newErrors = {};

    if (!saveaddress.userName.trim())
      newErrors.userName = "Full name is required";
    else if (saveaddress.userName.length > 50)
      newErrors.userName = "Max 50 characters allowed";

    if (!saveaddress.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(saveaddress.phone))
      newErrors.phone = "Phone must be exactly 10 digits";

    if (!saveaddress.house.trim()) newErrors.house = "House is required";
    else if (saveaddress.house.length > 10)
      newErrors.house = "Max 10 characters allowed";

    if (!saveaddress.landmark.trim()) newErrors.landmark = "Landmark required";
    else if (saveaddress.landmark.length > 50)
      newErrors.landmark = "Max 50 characters allowed";

    if (!saveaddress.addresstype.trim())
      newErrors.addresstype = "Address type required";
    else if (saveaddress.addresstype.length > 50)
      newErrors.addresstype = "Max 50 characters allowed";

    if (!saveaddress.pincode.trim()) newErrors.pincode = "Pincode required";
    else if (!/^\d{6}$/.test(saveaddress.pincode))
      newErrors.pincode = "Pincode must be exactly 6 digits";

    if (!saveaddress.city.trim()) newErrors.city = "City is required";
    else if (saveaddress.city.length > 50)
      newErrors.city = "Max 50 characters allowed";

    if (!saveaddress.country.trim()) newErrors.country = "Country required";
    else if (saveaddress.country.length > 50)
      newErrors.country = "Max 50 characters allowed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form
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
    setErrors({});
    setIsEditing(false);
    setEditIndex(null);
  };

  const token = localStorage.getItem("token");
  const decode = token ? jwtDecode(token) : {};
  const userid = decode?.userid;

  const mapToApiAddress = (addr, id = null) => ({
    ...(id !== null && { id }),
    uid: userid,
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

  // Submit or Update address
  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please Enter Valid Address ");
      return;
    }

    if (!token) {
      toast.error("User is not authenticated.");
      return;
    }

    try {
      if (isEditing && editIndex !== null) {
        const idToUpdate = addressList[editIndex].id;

        const response = await axios.put(
          `${APP_URL}/Addresses/${userid}`,
          mapToApiAddress(saveaddress, idToUpdate),
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const updatedList = [...addressList];
        updatedList[editIndex] = { ...saveaddress, id: response.data.id };
        setAddressList(updatedList);
        toast.success("Address updated successfully!");
      } else {
        const response = await axios.post(
          `${APP_URL}/Addresses`,
          mapToApiAddress(saveaddress),
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAddressList((prev) => [
          ...prev,
          { ...saveaddress, id: response.data.id },
        ]);
        toast.success("Address added successfully!");
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
    if (!token) {
      toast.error("User not authenticated.");
      return;
    }
    try {
      await axios.delete(`${APP_URL}/Addresses/${userid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddressList(addressList.filter((_, i) => i !== index));
      toast.success("Address deleted!");
      if (selectedAddressIndex === index) setSelectedAddressIndex(null);
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
            { label: "Phone", name: "phone", placeholder: "1234567890" },
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
                className={`w-full border px-2 py-2 rounded bg-white rounded-xl dark:shadow-md ${
                  errors[field.name] ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field.name]}
                </p>
              )}
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
      </div>
    </div>
  );
}

export default Address;
