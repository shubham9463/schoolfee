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
      <div className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 overflow-y-auto h-screen fixed left-0 top-0 z-50">

        {/* Background glow animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow-delayed" />
        </div>

        {/* Sidebar Top Admin Logo */}
        <div className="relative p-4 border-b border-slate-700/50">
          <div className="flex items-center">
            <div className="relative">
              <span className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-2 rounded-lg mr-2 font-bold shadow-lg shadow-emerald-500/50 block">
                SF
              </span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold text-white block">SchoolFee</span>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <div className="flex flex-col gap-2 p-4 relative">

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

         
         
        </div>

        {/* Footer System Status */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <p className="text-xs font-semibold text-emerald-400">System Online</p>
            </div>
            <p className="text-xs text-slate-400">All systems operational</p>
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
        @keyframes slide-in-left {
          from { transform: translateX(-10px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-pulse-slow-delayed { animation: pulse-slow-delayed 8s infinite 1s; }
        .animate-slide-in-left { animation: slide-in-left 0.3s ease-out; }
      `}</style>
    </>
  );
}

/* ----------------- REUSABLE SIDEBAR ITEM ----------------- */
function SidebarItem({ label, tab, icon, active, hoveredItem, setHoveredItem }) {
  return (
    <Link to={`/?tab=${tab}`} className="block group">
      <div
        className={`relative flex items-center p-2 rounded-lg cursor-pointer overflow-hidden transition-all duration-300 
        ${
          active
            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
            : "text-slate-300 hover:bg-slate-800/50"
        }`}
        onMouseEnter={() => setHoveredItem(tab)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {active && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full animate-slide-in-left" />
        )}

        <div
          className={`relative z-10 ${
            active ? "scale-110" : "group-hover:scale-110"
          } transition-transform duration-300`}
        >
          <SidebarIcon icon={icon} />
        </div>

        <span className="ml-3 text-sm font-medium relative z-10">{label}</span>

        {active && <div className="absolute right-2 w-2 h-2 bg-white/50 rounded-full animate-ping" />}
      </div>
    </Link>
  );
}
