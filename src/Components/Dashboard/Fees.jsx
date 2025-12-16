import React, { useState, useEffect } from 'react';
import { GraduationCap, Search, RefreshCw, DollarSign, Calendar, Clock, TrendingUp, Sparkles } from 'lucide-react';

const STORAGE_KEY = "school_fee_structure";

const FeeStructureCard = ({ classInfo }) => {
  // Calculate totals based on frequency
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => {
      if (item.frequency === 'Monthly') {
        return sum + (item.amount * 12);
      }
      return sum + item.amount;
    }, 0);
  };

  const monthlyItems = classInfo.items.filter(it => it.frequency === 'Monthly');
  const oneTimeItems = classInfo.items.filter(it => it.frequency === 'One-time');
  const perTermItems = classInfo.items.filter(it => it.frequency === 'Per-Term');
  const totalAnnual = calculateTotal(classInfo.items);
  const monthlyTotal = monthlyItems.reduce((sum, item) => sum + item.amount, 0);

  const getGradientClass = (className) => {
    const gradients = [
      'from-violet-500 to-purple-600',
      'from-blue-500 to-cyan-600',
      'from-emerald-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-pink-500 to-rose-600',
      'from-indigo-500 to-blue-600',
    ];
    const index = parseInt(className) || className.length;
    return gradients[index % gradients.length];
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105">
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${getGradientClass(classInfo.class)} p-6 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl">
              <div className="w-7 h-7 text-white text-2xl font-bold flex items-center justify-center">🎓</div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Class {classInfo.class}</h3>
              <p className="text-white text-opacity-90 text-sm flex items-center gap-1 mt-1">
                ✨ {classInfo.items.length} Fee Components
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Monthly Summary Card */}
        {monthlyItems.length > 0 && (
          <div className="mb-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Monthly Payment</span>
              </div>
              <span className="text-xl font-bold text-blue-600">₹{monthlyTotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {/* Monthly Fees */}
          {monthlyItems.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px bg-gradient-to-r from-blue-200 to-transparent flex-1"></div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Monthly</span>
                <div className="h-px bg-gradient-to-l from-blue-200 to-transparent flex-1"></div>
              </div>
              {monthlyItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors">
                  <span className="text-gray-700 flex items-center gap-2 text-sm font-medium">
                    <Clock className="w-4 h-4 text-blue-500" />
                    {item.item}
                  </span>
                  <span className="font-bold text-gray-800">₹{item.amount.toLocaleString()}</span>
                </div>
              ))}
            </>
          )}
          
          {/* One-time Fees */}
          {oneTimeItems.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-2 mt-4">
                <div className="h-px bg-gradient-to-r from-green-200 to-transparent flex-1"></div>
                <span className="text-xs font-bold text-green-600 uppercase tracking-wider">One-Time</span>
                <div className="h-px bg-gradient-to-l from-green-200 to-transparent flex-1"></div>
              </div>
              {oneTimeItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-green-50 transition-colors">
                  <span className="text-gray-700 text-sm font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    {item.item}
                  </span>
                  <span className="font-bold text-gray-800">₹{item.amount.toLocaleString()}</span>
                </div>
              ))}
            </>
          )}
          
          {/* Per-Term Fees */}
          {perTermItems.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-2 mt-4">
                <div className="h-px bg-gradient-to-r from-purple-200 to-transparent flex-1"></div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Per-Term</span>
                <div className="h-px bg-gradient-to-l from-purple-200 to-transparent flex-1"></div>
              </div>
              {perTermItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-purple-50 transition-colors">
                  <span className="text-gray-700 text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    {item.item}
                  </span>
                  <span className="font-bold text-gray-800">₹{item.amount.toLocaleString()}</span>
                </div>
              ))}
            </>
          )}
          
          {classInfo.items.length === 0 && (
            <div className="text-center py-8">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-sm font-medium">No fee structure set yet</p>
            </div>
          )}
        </div>
        
        {classInfo.items.length > 0 && (
          <div className="mt-5 pt-5 border-t-2 border-dashed border-gray-200">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-white text-opacity-90 mb-1">Estimated Annual Fee</p>
                  <p className="text-3xl font-bold">₹{totalAnnual.toLocaleString()}</p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl">
                  <div className="w-8 h-8 text-white text-3xl flex items-center justify-center">💰</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function SchoolFeeStructure() {
  const [searchTerm, setSearchTerm] = useState('');
  const [feeStructure, setFeeStructure] = useState({});
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  const CLASSES = ["Nursery", "KG", "1","2","3","4","5","6","7","8","9","10"];

  useEffect(() => {
    loadFeeStructure();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadFeeStructure();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const loadFeeStructure = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setFeeStructure(parsed);
        setLastUpdate(Date.now());
      } catch (e) {
        console.error('Error parsing fee structure:', e);
      }
    } else {
      const initial = {};
      CLASSES.forEach(c => { initial[c] = []; });
      setFeeStructure(initial);
    }
  };

  const manualRefresh = () => {
    loadFeeStructure();
  };

  const feeCards = CLASSES.map(className => ({
    class: className,
    items: feeStructure[className] || []
  }));

  const filteredFees = feeCards.filter(fee =>
    fee.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              Academic Year 2024-25
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            School Fee Structure
          </h1>
          <p className="text-gray-600 text-lg">Complete fee breakdown for all classes</p>
        </div>

        {/* Search Bar and Refresh */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by class (e.g., Nursery, 1, 2, 10)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400"
              />
            </div>
            <button
              onClick={manualRefresh}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg font-medium"
              title="Refresh fee structure"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-8 bg-white border-2 border-indigo-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-gray-800 font-medium">Auto-synced with Fee Settings</p>
                <p className="text-gray-500 text-sm">Last updated: {new Date(lastUpdate).toLocaleTimeString()}</p>
              </div>
            </div>
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live
            </div>
          </div>
        </div>

        {/* Fee Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredFees.map((fee, index) => (
            <FeeStructureCard key={index} classInfo={fee} />
          ))}
        </div>

        {filteredFees.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-xl font-medium">No classes found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search</p>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-10 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-md p-8 border border-indigo-100">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Fee Calculation Method</h3>
            <p className="text-gray-700 mb-2">
              <strong>Annual Fee:</strong> Monthly fees × 12 months + One-time fees + Per-Term fees
            </p>
            <p className="text-sm text-gray-600 mt-4">
              To modify fee structure, navigate to <span className="font-semibold text-indigo-600">Fee Settings</span> page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}