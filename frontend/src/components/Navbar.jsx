import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { api } from "../api/api";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return setIsLoggedIn(false);

    api.get("auth/register/me/")
      .then(() => setIsLoggedIn(true))
      .catch(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setIsLoggedIn(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/";
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md px-6 py-3 flex justify-between items-center fixed top-0 left-0 w-full z-50">
      <Link to="/">
        <img src={logo} alt="Logo" className="h-10 w-auto cursor-pointer" />
      </Link>

      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded transition">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-200">Login</Link>
            <Link to="/register" className="hover:text-gray-200">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;