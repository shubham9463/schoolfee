import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef();
  const notifRef = useRef();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="ml-60 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg border-b border-slate-700/50 relative z-[200] overflow-visible">
        
        {/* Glow Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl animate-pulse-slow" />
          <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl animate-pulse-slow-delayed" />
        </div>

        <div className="flex items-center justify-between h-20 px-6 relative z-10">
          
          {/* SchoolFee Branding */}
          <h1 className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            SchoolFee Admin Panel
          </h1>

          <div className="flex items-center space-x-4">

            {/* 🔔 Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                className="p-2 text-slate-300 hover:text-emerald-400 focus:outline-none transition-all duration-300 hover:bg-slate-800/50 rounded-lg relative group"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {/* Green Dot Indicator */}
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50">
                  <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping"></span>
                </span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-xl shadow-2xl py-1 border border-slate-700 animate-slide-down backdrop-blur-sm"
                  style={{ zIndex: 9999 }}
                >
                  <div className="px-4 py-3 border-b border-slate-700">
                    <p className="text-sm font-semibold text-white flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                      Notifications
                    </p>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-200 cursor-pointer">
                      <p className="text-sm font-medium text-white">
                        Welcome to SchoolFee Admin
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Manage all school operations from here.
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-2 text-center border-t border-slate-700">
                    <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-200 font-medium">
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 👤 Profile Dropdown */}
<div className="relative" ref={profileRef}>
  <button
    className="flex items-center focus:outline-none hover:bg-slate-800/50 rounded-lg px-2 py-1 transition-all duration-300 group"
    onClick={() => setShowProfileMenu(!showProfileMenu)}
  >
    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold shadow-lg relative">
      S
      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
    </div>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-5 w-5 ml-1 text-slate-400 transition-transform duration-300 ${
        showProfileMenu ? "rotate-180" : ""
      }`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  </button>

  {showProfileMenu && (
    <div
      className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-2xl py-1 border border-slate-700 animate-slide-down backdrop-blur-sm"
      style={{ zIndex: 9999 }}
    >
      {/* Profile */}
      <button
        className="block w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200"
        onClick={() => setShowProfileMenu(false)}
      >
        Profile
      </button>

      {/* NEW SETTINGS LINK */}
      <button
        onClick={() => {
          setShowProfileMenu(false);
          window.location.href = "/settings";   // 👈 Navigates to /settings route
        }}
        className="block w-full text-left px-4 py-2.5 text-sm text-emerald-400 hover:bg-slate-700/50 hover:text-white transition-all duration-200"
      >
        ⚙️ Settings
      </button>

      {/* (Optional) Logout */}
      <button
        className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-slate-700/50 hover:text-white transition-all duration-200"
        onClick={() => alert('Add Logout Logic')}
      >
        Logout
      </button>
    </div>
  )}
</div>


          </div>
        </div>
      </header>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%,100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes pulse-slow-delayed {
          0%,100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.15); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-pulse-slow { animation: pulse-slow 6s infinite ease-in-out; }
        .animate-pulse-slow-delayed { animation: pulse-slow-delayed 8s infinite ease-in-out 1s; }
        .animate-slide-down { animation: slide-down 0.25s ease-out; }
      `}</style>
    </>
  );
}
