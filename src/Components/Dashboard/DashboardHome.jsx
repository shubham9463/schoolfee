import React from "react";
import { students } from "../../Data/students";
import { feeRecords } from "../../Data/fees";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function DashboardHome() {
  const totalStudents = students.length;
  const collectedThisMonth = feeRecords
    .filter(r => r.date && new Date(r.date).getMonth() === new Date().getMonth())
    .reduce((s, r) => s + r.paid, 0);

  const pendingFees = feeRecords.reduce((s, r) => s + r.pending, 0);

  // sample bar: collected per month (dummy aggregate from feeRecords)
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const collectedByMonth = new Array(12).fill(0);
  feeRecords.forEach(r => {
    const m = new Date(r.date).getMonth();
    collectedByMonth[m] += r.paid;
  });

  const barData = {
    labels: months,
    datasets: [{ label: "Collection (₹)", data: collectedByMonth, borderRadius: 6 }]
  };

  // pie: status distribution
  const counts = { Paid:0, Partial:0, Pending:0 };
  feeRecords.forEach(r => counts[r.status] = (counts[r.status]||0)+1);
  const pieData = {
    labels: ["Paid","Partial","Pending"],
    datasets: [{ data: [counts.Paid, counts.Partial, counts.Pending] }]
  };

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-semibold text-slate-800">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Students" value={totalStudents} />
        <StatCard title="Collected This Month" value={`₹ ${collectedThisMonth}`} />
        <StatCard title="Pending Fees (₹)" value={`₹ ${pendingFees}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-medium mb-2">Monthly Collections</h3>
          <div className="h-60">
            <Bar data={barData} options={{ maintainAspectRatio:false, plugins:{legend:{display:false}} }} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-medium mb-2">Fee Status Distribution</h3>
          <div className="h-60 flex items-center justify-center">
            <div className="w-2/3">
              <Pie data={pieData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow flex flex-col">
      <span className="text-sm text-slate-500">{title}</span>
      <span className="text-2xl font-bold mt-2 text-slate-800">{value}</span>
    </div>
  );
}
