import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminDashboard from "./Pages/AdminDashboard";
import FeeCollection from "./Components/FeeCollection";
import FeeSettings from "./Pages/FeeSettings";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/fee-collection" element={<FeeCollection />} />
        
<Route path="/settings" element={<FeeSettings />} />
      </Routes>
    </Router>
  );
}
