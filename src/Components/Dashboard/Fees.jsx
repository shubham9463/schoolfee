import React, { useState, useEffect } from "react";
import { feeRecords, collectPayment } from "../../Data/fees";
import { students } from "../../Data/students";
import { useLocation } from "react-router-dom";

/**
 * Fee management + collection UI (in-memory)
 * - shows fee rows
 * - if URL has ?student=ID it auto-scrolls to that student rows (simple)
 */

export default function Fees() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const studentIdParam = params.get("student") ? Number(params.get("student")) : null;

  const [records, setRecords] = useState([...feeRecords]); // local copy
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (studentIdParam) {
      // select first record for that student
      const r = records.find(rr => rr.studentId === studentIdParam);
      if (r) setSelected(r);
    }
  }, [studentIdParam, records]);

  function handleSelect(rec) {
    setSelected(rec);
    setAmount("");
  }

  function handleCollect() {
    const amt = parseInt(amount || "0", 10);
    if (!selected || amt <= 0) { alert("Enter valid amount"); return; }
    const updated = collectPayment(selected.id, amt);
    // reflect update in local state
    setRecords([...feeRecords]);
    setSelected(updated);
    setAmount("");
    alert("Payment recorded (dummy)");
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold text-slate-800">Fees Management</h2>

      <div className="bg-white p-4 rounded-xl shadow">
        <table className="w-full text-left mb-4">
          <thead>
            <tr className="border-b">
              <th className="py-2">Student</th>
              <th>Month</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Pending</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {records.map(r => {
              const s = students.find(x => x.id === r.studentId);
              return (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-2">{s?.name}</td>
                  <td>{r.month}</td>
                  <td>₹ {r.total}</td>
                  <td>₹ {r.paid}</td>
                  <td>₹ {r.pending}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      r.status === "Paid" ? "bg-green-100 text-green-600" :
                      r.status === "Pending" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"
                    }`}>{r.status}</span>
                  </td>
                  <td>
                    <button onClick={() => handleSelect(r)} className="px-3 py-1 rounded bg-emerald-500 text-white text-sm">
                      Collect
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Collection Panel */}
        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Collection</h3>
          {!selected && <p className="text-sm text-slate-600">Select a student record to collect payment.</p>}

          {selected && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-slate-500">Student</div>
                <div className="font-semibold">{students.find(s => s.id === selected.studentId)?.name}</div>
                <div className="text-xs text-slate-400 mt-1">Month: {selected.month} | Session: {selected.session}</div>
              </div>

              <div>
                <div className="text-sm text-slate-500">Pending Amount</div>
                <div className="font-semibold text-red-600">₹ {selected.pending}</div>
                <div className="text-sm text-slate-400 mt-1">Total: ₹ {selected.total} | Paid: ₹ {selected.paid}</div>
              </div>

              <div>
                <div className="text-sm text-slate-500">Collect</div>
                <input
                  value={amount}
                  onChange={e=>setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="px-3 py-2 border rounded w-full"
                />
                <div className="mt-2 flex gap-2">
                  <button onClick={handleCollect} className="px-3 py-1 rounded bg-emerald-500 text-white">Confirm</button>
                  <button onClick={()=>{ setSelected(null); setAmount(""); }} className="px-3 py-1 rounded border">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
