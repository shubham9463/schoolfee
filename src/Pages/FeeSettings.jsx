import React, { useEffect, useState } from "react";

const CLASSES = ["Nursery", "KG", "1","2","3","4","5","6","7","8","9","10"];
const STORAGE_KEY = "school_fee_structure";

export default function FeeSettings() {
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [structure, setStructure] = useState({});
  const [newItemName, setNewItemName] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");
  const [newItemFreq, setNewItemFreq] = useState("Monthly"); // Monthly | One-time | Per-Term

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      setStructure(JSON.parse(raw));
    } else {
      // initialize default structure (optional small example)
      const initial = {
        Nursery: [
          { item: "Reg Fee", amount: 300, frequency: "One-time" },
          { item: "Monthly Fee", amount: 800, frequency: "Monthly" },
          { item: "Transport Fee", amount: 400, frequency: "Monthly" },
        ],
        KG: [
          { item: "Reg Fee", amount: 350, frequency: "One-time" },
          { item: "Monthly Fee", amount: 900, frequency: "Monthly" },
        ],
        "1": [
          { item: "Reg Fee", amount: 400, frequency: "One-time" },
          { item: "Monthly Fee", amount: 1000, frequency: "Monthly" },
          { item: "Science Lab Fee", amount: 200, frequency: "One-time" },
        ],
        // other classes start empty
      };
      CLASSES.forEach(c => { if (!initial[c]) initial[c] = []; });
      setStructure(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  }, []);

  // Save to localStorage
  function saveStructure(updated) {
    setStructure(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  // Add an item to selectedClass
  function addItem() {
    if (!newItemName.trim() || !newItemAmount) return alert("Enter name and amount");
    const updated = { ...structure };
    if (!updated[selectedClass]) updated[selectedClass] = [];
    updated[selectedClass] = [
      ...updated[selectedClass],
      { item: newItemName.trim(), amount: Number(newItemAmount), frequency: newItemFreq }
    ];
    setNewItemName("");
    setNewItemAmount("");
    setNewItemFreq("Monthly");
    saveStructure(updated);
  }

  // Remove item by index
  function removeItem(idx) {
    if (!confirm("Delete this fee item?")) return;
    const updated = { ...structure };
    updated[selectedClass] = updated[selectedClass].filter((_, i) => i !== idx);
    saveStructure(updated);
  }

  // Update amount or name or frequency inline
  function updateItem(idx, field, value) {
    const updated = { ...structure };
    updated[selectedClass] = updated[selectedClass].map((it, i) => {
      if (i !== idx) return it;
      return { ...it, [field]: field === "amount" ? Number(value) : value };
    });
    saveStructure(updated);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">Fee Settings</h2>
              <p className="text-gray-500 text-sm">Configure class-wise fee structure</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md">
              Class {selectedClass}
            </div>
          </div>
        </div>

        {/* Class Selection Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-indigo-100">
          <div className="flex gap-4 items-center flex-wrap">
            <label className="text-sm font-semibold text-gray-700">Select Class:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="flex-1 min-w-[200px] border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-4 py-2.5 rounded-xl transition-all outline-none bg-white font-medium text-gray-700"
            >
              {CLASSES.map(c => <option key={c}>{c}</option>)}
            </select>

            <button
              onClick={() => {
                // quick reset for selected class
                if (!confirm(`Clear all fee items for ${selectedClass}?`)) return;
                const updated = { ...structure, [selectedClass]: [] };
                saveStructure(updated);
              }}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Clear Class
            </button>
          </div>
        </div>

        {/* Existing Items Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Fee Items for Class {selectedClass}</h3>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
              {(structure[selectedClass] || []).length} items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-indigo-100">
                  <th className="pb-3 text-left font-semibold text-gray-700 text-sm uppercase tracking-wide">Item Name</th>
                  <th className="pb-3 text-left font-semibold text-gray-700 text-sm uppercase tracking-wide">Amount (₹)</th>
                  <th className="pb-3 text-left font-semibold text-gray-700 text-sm uppercase tracking-wide">Frequency</th>
                  <th className="pb-3 text-left font-semibold text-gray-700 text-sm uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {(structure[selectedClass] || []).map((it, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-indigo-50 transition-colors">
                    <td className="py-3 pr-3">
                      <input
                        className="border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 px-3 py-2 rounded-lg w-full transition-all outline-none"
                        value={it.item}
                        onChange={(e) => updateItem(idx, "item", e.target.value)}
                      />
                    </td>
                    <td className="py-3 pr-3 w-32">
                      <input
                        className="border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 px-3 py-2 rounded-lg w-full transition-all outline-none"
                        type="number"
                        value={it.amount}
                        onChange={(e) => updateItem(idx, "amount", e.target.value)}
                      />
                    </td>
                    <td className="py-3 pr-3 w-40">
                      <select
                        className="border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 px-3 py-2 rounded-lg w-full transition-all outline-none bg-white"
                        value={it.frequency}
                        onChange={(e) => updateItem(idx, "frequency", e.target.value)}
                      >
                        <option>Monthly</option>
                        <option>One-time</option>
                        <option>Per-Term</option>
                      </select>
                    </td>
                    <td className="py-3 w-32">
                      <button 
                        onClick={() => removeItem(idx)} 
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {(!(structure[selectedClass] || []).length) && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center">
                      <div className="text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="font-medium">No fee items yet for this class</p>
                        <p className="text-sm mt-1">Add your first item below</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New Item Card */}
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg p-6 border border-indigo-100">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Add New Fee Item</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
              <input
                placeholder="e.g. Computer Fee"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-4 py-2.5 rounded-xl w-full transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
              <input
                placeholder="0.00"
                value={newItemAmount}
                onChange={(e) => setNewItemAmount(e.target.value)}
                type="number"
                className="border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-4 py-2.5 rounded-xl w-full transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency</label>
              <select 
                value={newItemFreq} 
                onChange={(e) => setNewItemFreq(e.target.value)} 
                className="border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-4 py-2.5 rounded-xl w-full transition-all outline-none bg-white"
              >
                <option>Monthly</option>
                <option>One-time</option>
                <option>Per-Term</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={addItem} 
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
            >
              + Add Item
            </button>
            <button 
              onClick={() => {
                // Save current structure (useful if you edited inline)
                localStorage.setItem(STORAGE_KEY, JSON.stringify(structure));
                alert("Saved");
              }} 
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
            >
              💾 Save All
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-amber-200">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500 text-white rounded-full p-2 mt-0.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h5 className="font-bold text-gray-800 mb-2">Fee Frequency Information</h5>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs font-bold mt-0.5">M</span>
                  <span><strong>Monthly</strong> — Fee multiplied by selected months in Fee Collection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-500 text-white rounded-full px-2 py-0.5 text-xs font-bold mt-0.5">1</span>
                  <span><strong>One-time</strong> — Charged once per receipt</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-purple-500 text-white rounded-full px-2 py-0.5 text-xs font-bold mt-0.5">T</span>
                  <span><strong>Per-Term</strong> — Charged once per term</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}