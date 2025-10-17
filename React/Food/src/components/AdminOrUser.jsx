import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const APP_URL = import.meta.env.VITE_LOCAL_URL;

function AdminOrUser() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("User");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${APP_URL}/Users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  // Handle user selection
  const handleUserChange = (event) => {
    const userId = event.target.value;
    setSelectedUser(userId);

    const user = users.find((u) => u.id === parseInt(userId));
    if (user) {
      setSelectedRole(user.isAdmin ? "Admin" : "User");
    }
  };

  // Handle role selection
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  // Update role in backend
  const handleUpdateRole = async () => {
    if (!selectedUser) {
      toast.error("Please select a user.");
      return;
    }

    setIsLoading(true);

    try {
      const userToUpdate = users.find(
        (user) => user.id === parseInt(selectedUser)
      );

      if (userToUpdate) {
        const updatedUser = {
          ...userToUpdate,
          isAdmin: selectedRole === "Admin",
        };

        // Send updated user to the backend
        await axios.put(`${APP_URL}/Users/${userToUpdate.id}`, updatedUser, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Update the users list locally after successful update
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          )
        );

        toast.success("User role updated successfully!");
      }
    } catch (err) {
      toast.error("Failed to update user.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-orange-400">
        Change User Role
      </h2>

      {/* Select User */}
      <label className="block mb-2 font-semibold text-gray-800 dark:text-green-400">
        Select User
      </label>
      <select
        className="w-full p-3 mb-4 border rounded-lg bg-white text-gray-800 dark:bg-blue-200"
        value={selectedUser}
        onChange={handleUserChange}
      >
        <option value="">Select User or Admin</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} - {user.isAdmin ? "Admin" : "User"}
          </option>
        ))}
      </select>

      {/* Select Role */}
      <label className="block mb-2 font-semibold text-gray-800 dark:text-green-400">
        Select Role
      </label>
      <select
        className="w-full p-3 mb-4 border rounded-lg bg-white text-gray-800 dark:bg-blue-200"
        value={selectedRole}
        onChange={handleRoleChange}
        disabled={!selectedUser}
      >
        <option value="User">User</option>
        <option value="Admin">Admin</option>
      </select>

      <button
        type="button"
        onClick={handleUpdateRole}
        className={`w-full p-3 rounded-lg text-white ${
          isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update Role"}
      </button>

      <Toaster />
    </div>
  );
}

export default AdminOrUser;
