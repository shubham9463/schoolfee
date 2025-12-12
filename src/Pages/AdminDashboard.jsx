import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import AdminHeader from "../Components/Dashboard/Header";
import AdminSidebar from "../Components/Dashboard/Sidebar";

import DashboardHome from "../Components/Dashboard/DashboardHome";
import Students from "../Components/Dashboard/Students";
import Fees from "../Components/Dashboard/Fees";
import Reports from "../Components/Dashboard/Reports";
import AdmissionForm from "../Components/Dashboard/AdmissionForm";


export default function AdminDashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("dashboard");

  // Detect ?tab=something from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
      setTab(tabFromUrl);
    } else {
      setTab("dashboard");
    }
  }, [location.search]);

  return (
    <div className="flex min-h-screen">
      {/* ---------- LEFT SIDEBAR (Fixed) ---------- */}
      <div className="w-60 bg-white border-r shadow-md fixed left-0 top-0 h-screen overflow-y-auto z-50">
        <AdminSidebar />
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <AdminHeader />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="flex-1 p-5 ml-60">

            {/* Render Pages Based on Tab */}
            {tab === "dashboard" && <DashboardHome />}
            {tab === "students" && <Students />}
            {tab === "fees" && <Fees />}
            {tab === "reports" && <Reports />}
            {tab === "admission" && <AdmissionForm />}

            {/* Add more Schoolfee tabs here */}
            {/* Example:
                {tab === "transactions" && <Transactions />}
                {tab === "settings" && <Settings />}
            */}
          </div>
        </main>
      </div>
    </div>
  );
}
