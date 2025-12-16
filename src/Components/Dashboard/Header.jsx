import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef();
  const notifRef = useRef();
const navigate = useNavigate();

const handleLogout = () => {
  // Clear authentication data
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('authToken'); // if you use tokens
  
  // Redirect to login page
  navigate('/login', { replace: true });
};

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
      <header className="ml-60 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-b border-slate-700/50 relative z-[200] overflow-visible backdrop-blur-sm">
        
        {/* Enhanced Glow Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-gradient-to-tl from-blue-500/8 to-cyan-500/5 rounded-full blur-3xl animate-pulse-slow-delayed" />
          <div className="absolute top-1/2 left-1/2 w-28 h-28 bg-purple-500/5 rounded-full blur-3xl animate-float" />
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]" 
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }} 
          />
        </div>

        <div className="flex items-center justify-between h-20 px-8 relative z-10">
          
          {/* Enhanced SchoolFee Branding */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg blur-md group-hover:blur-lg transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                SchoolFee Admin
              </h1>
              <p className="text-xs text-slate-500 font-medium">Management Dashboard</p>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">

            {/* Search Bar (Optional Enhancement) */}
            <div className="hidden md:flex items-center bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2 hover:border-emerald-500/30 focus-within:border-emerald-500/50 transition-all duration-300">
              <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm text-slate-300 placeholder-slate-500 w-40"
              />
            </div>

            {/* Quick Actions Button */}
            <button className="p-2.5 text-slate-300 hover:text-emerald-400 focus:outline-none transition-all duration-300 hover:bg-slate-800/50 rounded-xl relative group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>

            {/* Divider */}
            <div className="h-8 w-px bg-slate-700/50" />

            {/* 🔔 Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                className="p-2.5 text-slate-300 hover:text-emerald-400 focus:outline-none transition-all duration-300 hover:bg-slate-800/50 rounded-xl relative group"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
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
                {/* Enhanced Green Dot Indicator */}
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="absolute inset-0 rounded-full bg-emerald-500 animate-pulse"></span>
                </span>
              </button>

              {/* Enhanced Notifications Dropdown */}
              {showNotifications && (
                <div
                  className="absolute right-0 mt-3 w-96 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 animate-slide-down backdrop-blur-xl overflow-hidden"
                  style={{ zIndex: 9999 }}
                >
                  {/* Header */}
                  <div className="px-5 py-4 border-b border-slate-700/50 bg-slate-800/50">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></span>
                        Notifications
                        <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">3</span>
                      </p>
                      <button className="text-slate-400 hover:text-white transition-colors duration-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-80 overflow-y-auto">
                    <div className="px-5 py-4 border-b border-slate-700/30 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer group">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors duration-200">
                            Welcome to SchoolFee Admin
                          </p>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Manage all school operations from here.
                          </p>
                          <p className="text-xs text-slate-500 mt-2">2 minutes ago</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-4 border-b border-slate-700/30 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer group">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors duration-200">
                            New Student Registration
                          </p>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            5 new students registered today.
                          </p>
                          <p className="text-xs text-slate-500 mt-2">1 hour ago</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-4 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer group">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors duration-200">
                            Fee Payment Received
                          </p>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Payment of ₹12,500 received from Class 5-A.
                          </p>
                          <p className="text-xs text-slate-500 mt-2">3 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 text-center border-t border-slate-700/50 bg-slate-800/50">
                    <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors duration-200 font-semibold">
                      View all notifications →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 👤 Enhanced Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center focus:outline-none hover:bg-slate-800/50 rounded-xl px-3 py-2 transition-all duration-300 group gap-3"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                  <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg text-base">
                    S
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 shadow-lg shadow-green-400/50">
                      <span className="absolute inset-0 bg-green-400 rounded-full animate-pulse"></span>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-white">Admin User</p>
                  <p className="text-xs text-slate-400">Super Admin</p>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
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

              {/* Enhanced Profile Dropdown Menu */}
              {showProfileMenu && (
                <div
                  className="absolute right-0 mt-3 w-64 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 animate-slide-down backdrop-blur-xl overflow-hidden"
                  style={{ zIndex: 9999 }}
                >
                  {/* User Info Header */}
                  <div className="px-5 py-4 border-b border-slate-700/50 bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg">
                        S
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Admin User</p>
                        <p className="text-xs text-emerald-400">admin@school.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 group"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium">My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        window.location.href = "/settings";
                      }}
                      className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm text-emerald-400 hover:bg-slate-700/50 hover:text-emerald-300 transition-all duration-200 group"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 group-hover:rotate-90 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">Settings</span>
                    </button>

                    <div className="my-2 mx-3 h-px bg-slate-700/50" />

                    <button
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-slate-700/50 hover:text-white transition-all duration-200"
                         onClick={handleLogout}  >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%,100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes pulse-slow-delayed {
          0%,100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.15); }
        }
        @keyframes float {
          0%,100% { opacity: 0.15; transform: translateY(0) scale(1); }
          50% { opacity: 0.25; transform: translateY(-10px) scale(1.05); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-15px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-pulse-slow { animation: pulse-slow 6s infinite ease-in-out; }
        .animate-pulse-slow-delayed { animation: pulse-slow-delayed 8s infinite ease-in-out 1s; }
        .animate-float { animation: float 10s infinite ease-in-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
      `}</style>
    </>
  );
}