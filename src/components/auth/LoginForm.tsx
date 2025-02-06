


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import UserService from "../../services/User.service";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css"; // Import Toastify CSS

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "societystore9555@gmail.com",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await UserService.login(formData); // Perform login
      const user = JSON.parse(localStorage.getItem("user") || "{}"); // Retrieve user data from local storage

      if (user.role === "user") {
        navigate("/salesuser"); // Navigate to /sales if role is "user"
      } else {
        navigate("/dashboard"); // Navigate to /dashboard for other roles
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);

      // Check if the error is related to the wrong password
      if (errorMessage.toLowerCase().includes("wrong password")) {
        Toastify({
          text: "Wrong password. Please try again.",
          duration: 5000,
          close: true,
          gravity: "top", // Position the toast at the top
          position: "center", // Center the toast horizontally
          style: {
            background: "linear-gradient(to right, #ff4e50, #ff6136)", // Optional custom style
            color: "#fff",
            borderRadius: "10px",
            padding: "10px 20px",
          },
        }).showToast();
      } else {
        // Show general error if it's not related to password
        Toastify({
          text: errorMessage,
          duration: 5000,
          close: true,
          gravity: "top", // Position the toast at the top
          position: "center", // Center the toast horizontally
          style: {
            background: "linear-gradient(to right, #ff4e50, #ff6136)", // Optional custom style
            color: "#fff",
            borderRadius: "10px",
            padding: "10px 20px",
          },
        }).showToast();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <LogIn className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="text-center">
          {/* <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Don't have an account? Register
          </button> */}
        </div>
      </div>
    </div>
  );
}
