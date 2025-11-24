import React, { useState } from "react";
import api from "../api/api";

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true) //button login disabled
    try {
      const response = await api.post("token/", formData);
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      window.location.href = "/chat";
    } catch (err) {
      setError("Invalid credentials");
    }finally {
      setLoading(false); // <-- button login enabled
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6
                 sm:p-8 md:p-10 transition-all"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Login
      </h2>

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        disabled={loading}
      >
        Login
      </button>

      {error && (
        <p className="mt-4 text-center text-red-600 bg-red-100 border border-red-300 rounded py-2">
          {error}
        </p>
      )}
    </form>
  );
};

export default LoginForm;