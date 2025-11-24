import React, { useState } from "react";
import {api, setAuthToken} from "../api/api";

const RegisterForm = () => {
  const [formData, setFormData] = useState({ 
    username: "", 
    email: "", 
    password: "",
    first_name: "",
    last_name: "" });
  const [message, setMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setLoading(true) //button register disabled

    try {
      setAuthToken(null); 

      //registracija
      await api.post("auth/register/", formData);
      setMessage("Registration successful! You can now log in.");

      //Automatski login
      const loginResponse = await api.post("token/",{username:formData.username, password:formData.password})

      //Čuvamo token
      localStorage.setItem("access", loginResponse.data.access);
      localStorage.setItem("refresh", loginResponse.data.refresh);

      // 5. Redirect
      window.location.href = "/chat";

    } catch (err) {
      setMessage(err);
    }finally {
      setLoading(false); // <-- button register enabled
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Register
      </h2>
      <input
        type="text"
        name="first_name"
        placeholder="First Name"
        value={formData.first_name}
        onChange={handleChange}
        className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="text"
        name="last_name"
        placeholder="Last Name"
        value={formData.last_name}
        onChange={handleChange}
        className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

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
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
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

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
        disabled={loading}>
        Register
      </button>
      {message && (
  <p
    className={`mt-4 text-center py-2 rounded border 
      ${
        typeof message === 'string' && message.toLowerCase().includes('success')
          ? 'bg-green-100 text-green-700 border-green-300'
          : 'bg-red-100 text-red-700 border-red-300'
      }`}
    >
    {typeof message === 'string' ? message : JSON.stringify(message)}
    </p>
  )}
    </form>
  );
};

export default RegisterForm;