import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AdminDashboard from "./Pages/AdminDashboard";
import FeeCollection from "./Components/FeeCollection";
import FeeSettings from "./Pages/FeeSettings";
import LoginPage from "./Pages/LoginPage"; // Your login component

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route - Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/fee-collection" 
          element={
            <ProtectedRoute>
              <FeeCollection />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <FeeSettings />
            </ProtectedRoute>
          } 
        />

        {/* Catch all - redirect to login if not authenticated, otherwise to dashboard */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  );
}