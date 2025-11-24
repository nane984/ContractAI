import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const token = localStorage.getItem("access");

  return (
    <Router>
  <div className="flex flex-col h-screen">
    <Navbar />
    <main className="flex-1 flex overflow-hidden pt-16">
      <Routes>
        <Route path="/" element={token ? <Navigate to="/chat" /> : <LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      </Routes>
    </main>
  </div>
</Router>

  );
};

export default App;