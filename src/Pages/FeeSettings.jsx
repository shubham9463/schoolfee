// src/pages/FeeSettings.jsx
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
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-3">Fee Settings — Class-wise</h2>

      <div className="mb-3 flex gap-3 items-center">
        <label className="text-sm">Select Class</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border px-2 py-1 rounded"
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
          className="ml-auto text-sm bg-red-500 text-white px-3 py-1 rounded"
        >
          Clear Class
        </button>
      </div>

      {/* Existing items */}
      <div className="bg-slate-50 p-3 rounded border mb-4">
        <h3 className="font-semibold mb-2">Items for {selectedClass}</h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="pb-1">Item</th>
              <th className="pb-1">Amount</th>
              <th className="pb-1">Frequency</th>
              <th className="pb-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {(structure[selectedClass] || []).map((it, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-2">
                  <input
                    className="border px-1 py-1 text-sm rounded w-full"
                    value={it.item}
                    onChange={(e) => updateItem(idx, "item", e.target.value)}
                  />
                </td>
                <td className="py-2 w-28">
                  <input
                    className="border px-1 py-1 text-sm rounded w-full"
                    type="number"
                    value={it.amount}
                    onChange={(e) => updateItem(idx, "amount", e.target.value)}
                  />
                </td>
                <td className="py-2 w-32">
                  <select
                    className="border px-1 py-1 text-sm rounded w-full"
                    value={it.frequency}
                    onChange={(e) => updateItem(idx, "frequency", e.target.value)}
                  >
                    <option>Monthly</option>
                    <option>One-time</option>
                    <option>Per-Term</option>
                  </select>
                </td>
                <td className="py-2 w-28">
                  <button onClick={() => removeItem(idx)} className="text-sm bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {(!(structure[selectedClass] || []).length) && (
              <tr><td colSpan={4} className="py-2 text-sm text-slate-500">No items yet for this class.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add new item */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-medium mb-2">Add new fee item</h4>
        <div className="grid grid-cols-3 gap-2 items-end">
          <input
            placeholder="Item name (e.g. Computer Fee)"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          />
          <input
            placeholder="Amount"
            value={newItemAmount}
            onChange={(e) => setNewItemAmount(e.target.value)}
            type="number"
            className="border px-2 py-1 rounded text-sm"
          />
          <select value={newItemFreq} onChange={(e) => setNewItemFreq(e.target.value)} className="border px-2 py-1 rounded text-sm">
            <option>Monthly</option>
            <option>One-time</option>
            <option>Per-Term</option>
          </select>
        </div>

        <div className="mt-3 flex gap-2">
          <button onClick={addItem} className="bg-emerald-600 text-white px-3 py-1 rounded text-sm">Add Item</button>
          <button onClick={() => {
            // Save current structure (useful if you edited inline)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(structure));
            alert("Saved");
          }} className="bg-slate-600 text-white px-3 py-1 rounded text-sm">Save All</button>
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-500">
        <b>Note:</b> Frequencies determine how the item is billed:
        <ul className="list-disc ml-5">
          <li><b>Monthly</b> → multiplied by selected months in Fee Collection.</li>
          <li><b>One-time</b> → charged once per receipt.</li>
          <li><b>Per-Term</b> → charged once per term (treated like one-time here).</li>
        </ul>
      </div>
    </div>
  );
}
