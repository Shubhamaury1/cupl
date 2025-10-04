import React, { useEffect, useState } from "react";
import axios from "axios";

const APP_URL = import.meta.env.VITE_LOCAL_URL;

function AdminOrUser() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("User");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${APP_URL}/Users`);
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
    const user = users.find((u) => u.id === parseInt(event.target.value));
    if (user) {
      setSelectedRole(user.isAdmin ? "Admin" : "User");
    }
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleUpdateAdmin = async () => {
    if (!selectedUser) {
      alert("Please select a user.");
      return;
    }

    setIsLoading(true);

    try {
      // Find the selected user
      const userToUpdate = users.find(
        (user) => user.id === parseInt(selectedUser)
      );

      if (userToUpdate) {
        // Ensure only one user is an admin
        const newAdminStatus = selectedRole === "Admin";

        if (newAdminStatus) {
          // Check if another admin exists
          const existingAdmin = users.find((user) => user.isAdmin);
          if (existingAdmin) {
            alert(
              "There can only be one admin. Please remove the current admin status."
            );
            setIsLoading(false);
            return;
          }
        }

        // Update user admin status
        const updatedUser = {
          ...userToUpdate,
          isAdmin: newAdminStatus,
        };

        // Send update to backend
        await axios.put(`${APP_URL}/Users/${userToUpdate.id}`, updatedUser);

        // Update the local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          )
        );

        alert(`User role updated successfully!`);
      }
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Failed to update user.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        Change User Role
      </h2>

      {/* Select User */}
      <label className="block mb-2 font-semibold text-gray-800 dark:text-green-500">
        Select User
      </label>
      <select
        className="w-full p-3 mb-4 border rounded-lg bg-white text-gray-800 dark:bg-blue-200"
        value={selectedUser}
        onChange={handleUserChange}
      >
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} - {user.isAdmin ? "Admin" : "User"}
          </option>
        ))}
      </select>

      {/* Select Role */}
      <label className="block mb-2 font-semibold text-gray-800 dark:text-green-500">
        Select Role
      </label>
      <select
        className="w-full p-3 mb-4 border rounded-lg bg-white text-gray-800 dark:bg-blue-200"
        value={selectedRole}
        onChange={handleRoleChange}
        disabled={!selectedUser}
      >
        <option value="User">User</option>
        {selectedRole === "User" && <option value="Admin">Admin</option>}
      </select>

      <button
        type="button"
        onClick={handleUpdateAdmin}
        className={`w-full p-3 rounded-lg text-white ${
          isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update Role"}
      </button>
    </div>
  );
}

export default AdminOrUser;
