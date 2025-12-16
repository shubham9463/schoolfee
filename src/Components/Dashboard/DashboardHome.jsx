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
    datasets: [{
      label: "Collection (₹)",
      data: collectedByMonth,
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: 'rgba(16, 185, 129, 1)',
    }]
  };

  // pie: status distribution
  const counts = { Paid:0, Partial:0, Pending:0 };
  feeRecords.forEach(r => counts[r.status] = (counts[r.status]||0)+1);
  const pieData = {
    labels: ["Paid","Partial","Pending"],
    datasets: [{
      data: [counts.Paid, counts.Partial, counts.Pending],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderColor: [
        'rgba(16, 185, 129, 1)',
        'rgba(251, 191, 36, 1)',
        'rgba(239, 68, 68, 1)',
      ],
      borderWidth: 2,
      hoverOffset: 8,
    }]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Dashboard Overview
              </h2>
              <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Students" 
            value={totalStudents}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            gradient="from-blue-500 to-indigo-600"
            change="+12%"
            changeType="increase"
          />
          <StatCard 
            title="Collected This Month" 
            value={`₹ ${collectedThisMonth.toLocaleString()}`}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 trending-up M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            gradient="from-emerald-500 to-teal-600"
            change="+8%"
            changeType="increase"
          />
          <StatCard 
            title="Pending Fees" 
            value={`₹ ${pendingFees.toLocaleString()}`}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            gradient="from-orange-500 to-red-600"
            change="-5%"
            changeType="decrease"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Monthly Collections
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Fee collection trends across months</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="h-72">
                <Bar 
                  data={barData} 
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        borderRadius: 8,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 13 },
                      }
                    },
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { color: '#64748b', font: { size: 11 } }
                      },
                      y: {
                        grid: { color: 'rgba(226, 232, 240, 0.5)' },
                        ticks: { color: '#64748b', font: { size: 11 } }
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    Fee Status Distribution
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Current payment status breakdown</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="h-72 flex items-center justify-center">
                <div className="w-full max-w-sm">
                  <Pie 
                    data={pieData}
                    options={{
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            padding: 15,
                            font: { size: 12, weight: '600' },
                            color: '#475569',
                            usePointStyle: true,
                            pointStyle: 'circle',
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          padding: 12,
                          borderRadius: 8,
                          titleFont: { size: 14, weight: 'bold' },
                          bodyFont: { size: 13 },
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <QuickStatCard
            label="Collection Rate"
            value="87%"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            color="emerald"
          />
          <QuickStatCard
            label="New Admissions"
            value="24"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            }
            color="blue"
          />
          <QuickStatCard
            label="Total Classes"
            value="12"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            color="purple"
          />
          <QuickStatCard
            label="Active Teachers"
            value="48"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            color="orange"
          />
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon, gradient, change, changeType }) {
  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-all duration-300`} />
      
      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Background decoration */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full -mr-16 -mt-16`} />
        
        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</p>
            <p className="text-3xl font-bold text-slate-800 mb-2">{value}</p>
            {change && (
              <div className={`flex items-center gap-1 text-sm font-semibold ${changeType === 'increase' ? 'text-emerald-600' : 'text-red-600'}`}>
                <svg className={`w-4 h-4 ${changeType === 'decrease' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>{change} from last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg text-white`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStatCard({ label, value, icon, color }) {
  const colorClasses = {
    emerald: 'from-emerald-500 to-teal-500 text-emerald-600 bg-emerald-50',
    blue: 'from-blue-500 to-indigo-500 text-blue-600 bg-blue-50',
    purple: 'from-purple-500 to-pink-500 text-purple-600 bg-purple-50',
    orange: 'from-orange-500 to-red-500 text-orange-600 bg-orange-50'
  };

  return (
    <div className={`bg-white rounded-xl shadow-md border border-slate-200 p-4 hover:shadow-lg transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color].split(' ')[3]}`}>
          <div className={`${colorClasses[color].split(' ')[2]}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}