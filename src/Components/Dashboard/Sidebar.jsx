import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  PieChart,
  Users,
  CreditCard,
  MessageSquare,
  FileText,
} from "lucide-react";

const SidebarIcon = ({ icon: Icon }) => <Icon size={20} />;

export default function Sidebar() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();

  const isActiveTab = (tab) => location.search.includes(`tab=${tab}`);

  return (
    <>
      <div className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 overflow-y-auto h-screen fixed left-0 top-0 z-50 shadow-2xl">

        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated gradient orbs */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/3 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/15 to-cyan-500/10 rounded-full blur-3xl animate-pulse-slow-delayed" />
          <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tl from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float" />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Sidebar Top Admin Logo */}
        <div className="relative p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              <span className="relative bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-3 rounded-xl font-bold shadow-xl shadow-emerald-500/50 block text-lg">
                SF
              </span>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse shadow-lg shadow-green-400/50" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent block">
                SchoolFee
              </span>
              <p className="text-xs text-emerald-400 font-medium">Admin Panel</p>
            </div>
          </div>
          
          {/* Decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        </div>

        {/* Sidebar Menu Items */}
        <div className="flex flex-col gap-2 p-4 relative">
          {/* Section Label */}
          <div className="px-2 mb-2 mt-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Main Menu</p>
          </div>

          <SidebarItem
            label="Dashboard"
            tab="dashboard"
            icon={PieChart}
            active={isActiveTab("dashboard")}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
          />

          <SidebarItem
            label="Admission"
            tab="admission"
            icon={Users}
            active={isActiveTab("admission")}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
          />

          <SidebarItem
            label="Students"
            tab="students"
            icon={Users}
            active={isActiveTab("students")}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
          />

          <SidebarItem
            label="Fees"
            tab="fees"
            icon={CreditCard}
            active={isActiveTab("fees")}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
          />

          {/* Decorative Divider */}
          <div className="my-4 px-2">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>

          {/* Quick Stats Card */}
          <div className="mx-2 p-4 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Students</p>
                <p className="text-lg font-bold text-white">1,247</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
              </div>
              <span className="text-emerald-400 font-semibold">75%</span>
            </div>
          </div>
        </div>

        {/* Footer System Status */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            
            {/* Card */}
            <div className="relative bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-4 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                </div>
                <p className="text-xs font-bold text-emerald-400">System Online</p>
              </div>
              <p className="text-xs text-slate-400 mb-2">All systems operational</p>
              
              {/* Mini indicators */}
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span className="text-[10px] text-slate-500">DB</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span className="text-[10px] text-slate-500">API</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span className="text-[10px] text-slate-500">Server</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes pulse-slow-delayed {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.15); }
        }
        @keyframes float {
          0%, 100% { opacity: 0.25; transform: translateY(0) scale(1); }
          50% { opacity: 0.35; transform: translateY(-10px) scale(1.05); }
        }
        @keyframes slide-in-left {
          from { transform: translateX(-10px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-pulse-slow-delayed { animation: pulse-slow-delayed 8s infinite 1s; }
        .animate-float { animation: float 10s ease-in-out infinite; }
        .animate-slide-in-left { animation: slide-in-left 0.3s ease-out; }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>
    </>
  );
}

/* ----------------- REUSABLE SIDEBAR ITEM ----------------- */
function SidebarItem({ label, tab, icon, active, hoveredItem, setHoveredItem }) {
  const isHovered = hoveredItem === tab;
  
  return (
    <Link to={`/?tab=${tab}`} className="block group">
      <div
        className={`relative flex items-center p-3 rounded-xl cursor-pointer overflow-hidden transition-all duration-300 
        ${
          active
            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105"
            : "text-slate-300 hover:bg-slate-800/70 hover:scale-102 hover:shadow-lg hover:shadow-slate-900/50"
        }`}
        onMouseEnter={() => setHoveredItem(tab)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {/* Active indicator bar */}
        {active && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full animate-slide-in-left shadow-lg shadow-white/50" />
            {/* Shimmer effect */}
            <div className="absolute inset-0 animate-shimmer" />
          </>
        )}

        {/* Hover glow effect */}
        {isHovered && !active && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl" />
        )}

        {/* Icon with enhanced animation */}
        <div
          className={`relative z-10 ${
            active ? "scale-110" : isHovered ? "scale-110" : ""
          } transition-all duration-300`}
        >
          <div className={`p-2 rounded-lg ${
            active 
              ? "bg-white/20 shadow-inner" 
              : isHovered 
                ? "bg-slate-700/50" 
                : ""
          } transition-all duration-300`}>
            <SidebarIcon icon={icon} />
          </div>
        </div>

        {/* Label with enhanced typography */}
        <span className={`ml-3 text-sm font-semibold relative z-10 ${
          active ? "tracking-wide" : ""
        } transition-all duration-300`}>
          {label}
        </span>

        {/* Active pulse indicator */}
        {active && (
          <div className="absolute right-3 flex items-center gap-1">
            <div className="w-2 h-2 bg-white/70 rounded-full animate-ping" />
            <div className="w-2 h-2 bg-white rounded-full absolute" />
          </div>
        )}

        {/* Hover arrow indicator */}
        {isHovered && !active && (
          <div className="absolute right-3 text-emerald-400 transform translate-x-0 opacity-100 transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </Link>
  );
}