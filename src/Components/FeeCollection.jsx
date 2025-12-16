// src/pages/FeeCollection.jsx
import React, { useState, useEffect } from "react";

const FEE_KEY = "school_fee_structure";
const RECEIPT_KEY = "feeReceipts";
const STUDENT_KEY = "school_students";

export default function FeeCollection() {
  const getStudentIdFromURL = () => new URLSearchParams(window.location.search).get("student");

  const [student, setStudent] = useState(null);
  const [paymentDate] = useState(new Date().toISOString().split("T")[0]);

  const [selectedMonths, setSelectedMonths] = useState({
    Apr:false,May:false,Jun:false,Jul:false,Aug:false,Sep:false,Oct:false,Nov:false,Dec:false,Jan:false,Feb:false,Mar:false
  });
  const [selectAll, setSelectAll] = useState(false);
  const [showFeeTable, setShowFeeTable] = useState(false);

  const [feeStructure, setFeeStructure] = useState({});
  const [totalFee, setTotalFee] = useState(0);
  const [additionalFee, setAdditionalFee] = useState(0);
  const [concessionPercent, setConcessionPercent] = useState(0);
  const [concessionAmt, setConcessionAmt] = useState(0);
  const [netFee, setNetFee] = useState(0);
  const [amountReceived, setAmountReceived] = useState(0);
  const [newBalance, setNewBalance] = useState(0);
  const [oldBalance, setOldBalance] = useState(0);

  const [paymentMode, setPaymentMode] = useState("Cash");
  const [bankName, setBankName] = useState("");
  const [chequeNo, setChequeNo] = useState("");
  const [chequeDate, setChequeDate] = useState("");
  const [remark, setRemark] = useState("");
  const [sendSMS, setSendSMS] = useState(true);
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [selectedFeeItems, setSelectedFeeItems] = useState({});

  useEffect(() => {
    const raw = localStorage.getItem(FEE_KEY);
    setFeeStructure(raw ? JSON.parse(raw) : {});
  }, []);

  useEffect(() => {
    const studentId = getStudentIdFromURL();
    const raw = localStorage.getItem(STUDENT_KEY);
    const students = raw ? JSON.parse(raw) : [];
    const found = students.find(s => String(s.id) === String(studentId));
    if (found) {
      setStudent(found);
      const receiptsRaw = localStorage.getItem(RECEIPT_KEY);
      const receipts = receiptsRaw ? JSON.parse(receiptsRaw) : [];
      const my = receipts.filter(r => String(r.studentId) === String(found.id));
      if (my.length) setOldBalance(my[my.length - 1].newBalance || 0);
    }
  }, []);

  function getMonthCount() {
    return Object.values(selectedMonths).filter(Boolean).length;
  }

  function getClassFees() {
    if (!student) return [];
    const clsKey = String(student.class);
    return (feeStructure[clsKey] || feeStructure[student.class] || []);
  }

  function getLateFineInfo() {
    const today = new Date(paymentDate);
    const dueDate = new Date(today.getFullYear(), today.getMonth(), 10);

    if (today <= dueDate) {
      return { lateDays: 0, fine: 0 };
    }

    const diffTime = today - dueDate;
    const lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const fine = lateDays * 5;

    return { lateDays, fine };
  }

  function computeFeeBreakdown() {
    const items = getClassFees();
    const months = getMonthCount();
    const { fine: fineAmount } = getLateFineInfo();

    const feeRows = items.map(it => {
      const checked = selectedFeeItems[it.item] !== false;

      let qty = 1;
      if (!months) {
        qty = it.frequency === "Monthly" ? 0 : 1;
      } else {
        qty = it.frequency === "Monthly" ? months : 1;
      }

      const total = checked ? (it.amount || 0) * qty : 0;
      return { ...it, qty, total, checked };
    });

    if (fineAmount > 0) {
      feeRows.push({
        item: "Late Fee Fine",
        frequency: "Daily",
        amount: 5,
        qty: fineAmount / 5,
        total: fineAmount,
        checked: true,
        isFine: true
      });
    }

    return feeRows;
  }

  useEffect(() => {
    const breakdown = computeFeeBreakdown();
    const base = breakdown.reduce((s, i) => s + i.total, 0);
    setTotalFee(base);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeStructure, student, selectedMonths, selectedFeeItems]);

  useEffect(() => {
    const total = totalFee + (additionalFee || 0);
    const concession = concessionAmt || (total * (concessionPercent || 0) / 100);
    const net = total - concession + (oldBalance || 0);
    setNetFee(net);
    setNewBalance(net - (amountReceived || 0));
  }, [totalFee, additionalFee, concessionPercent, concessionAmt, oldBalance, amountReceived]);

  const input = "border-2 border-gray-200 px-3 py-2.5 text-sm rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

  if (!student) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800">Student Not Found</h2>
          <p className="text-gray-600 mt-2">Please check the student ID and try again</p>
        </div>
      </div>
    );
  }

  function saveReceipt() {
    if (!amountReceived || amountReceived <= 0) {
      return alert("Enter amount received");
    }
    const receipt = {
      id: Date.now(),
      studentId: student.id,
      studentName: student.name,
      class: student.class,
      section: student.section,
      paymentDate,
      selectedMonths,
      feeBreakdown: computeFeeBreakdown().filter(f => f.checked),
      totalFee,
      additionalFee,
      concessionPercent,
      concessionAmt,
      oldBalance,
      netFee,
      amountReceived,
      newBalance,
      paymentMode,
      bankName,
      chequeNo,
      chequeDate,
      remark,
      sendSMS,
      sendWhatsApp
    };
    const raw = localStorage.getItem(RECEIPT_KEY);
    const receipts = raw ? JSON.parse(raw) : [];
    receipts.push(receipt);
    localStorage.setItem(RECEIPT_KEY, JSON.stringify(receipts));
    alert("Saved!");
    window.print();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Fee Collection
              </h2>
              <p className="text-gray-600 mt-1">Process student fee payment</p>
            </div>
            <button 
              onClick={() => window.history.back()} 
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Student Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              {student.photo ? (
                <img 
                  src={student.photo} 
                  className="h-32 w-32 rounded-xl object-cover border-4 border-blue-100 shadow-md" 
                  alt="student"
                />
              ) : (
                <div className="h-32 w-32 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-4xl font-bold text-white shadow-md">
                  {String(student.name || " ")[0]}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600 font-semibold mb-1">Student Name</p>
                  <p className="text-gray-800 font-bold text-lg">{student.name}</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3">
                  <p className="text-xs text-indigo-600 font-semibold mb-1">Class & Section</p>
                  <p className="text-gray-800 font-bold text-lg">{student.class}-{student.section}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-600 font-semibold mb-1">Father's Name</p>
                  <p className="text-gray-800 font-semibold">{student.fatherName}</p>
                </div>
                <div className="bg-pink-50 rounded-lg p-3">
                  <p className="text-xs text-pink-600 font-semibold mb-1">Registration No</p>
                  <p className="text-gray-800 font-semibold">{student.regNo}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-semibold mb-1">Mobile</p>
                  <p className="text-gray-800 font-semibold">{student.mobile}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs text-orange-600 font-semibold mb-1">Student ID</p>
                  <p className="text-gray-800 font-semibold">{student.id}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-semibold mb-1">Old Balance</p>
                  <p className="text-gray-800 font-bold text-lg">₹{oldBalance}</p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-3">
                  <p className="text-xs text-cyan-600 font-semibold mb-1">Payment Date</p>
                  <p className="text-gray-800 font-semibold">{paymentDate}</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 mt-4">
                <p className="text-xs text-slate-600 font-semibold mb-1">Address</p>
                <p className="text-gray-800">{student.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Month Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📅 Month Selection
          </h3>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <label className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md flex items-center gap-2 font-medium">
              <input 
                type="checkbox" 
                checked={selectAll} 
                onChange={() => {
                  const v = !selectAll;
                  setSelectAll(v);
                  setSelectedMonths(Object.fromEntries(Object.keys(selectedMonths).map(m => [m, v])));
                }} 
                className="w-4 h-4"
              /> 
              Select All
            </label>

            {Object.keys(selectedMonths).map(m => (
              <label 
                key={m} 
                className={`px-4 py-2 rounded-lg cursor-pointer transition-all border-2 font-medium ${
                  selectedMonths[m] 
                    ? 'bg-blue-500 text-white border-blue-500 shadow-md' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={selectedMonths[m]} 
                  onChange={() => setSelectedMonths(p => ({ ...p, [m]: !p[m] }))} 
                  className="hidden"
                /> 
                {m}
              </label>
            ))}
          </div>

          {Object.values(selectedMonths).includes(true) && (
            <button
              onClick={() => {
                const init = {};
                getClassFees().forEach(it => (init[it.item] = true));
                setSelectedFeeItems(init);
                setShowFeeTable(true);
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              ✨ Show Fee Structure
            </button>
          )}
        </div>

        {/* Fee Structure Table */}
        {showFeeTable && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              💰 Fee Structure for Class {student.class}
            </h3>

            {(() => {
              const { lateDays, fine } = getLateFineInfo();
              if (fine === 0) return null;

              return (
                <div className="mb-4 p-4 rounded-xl border-2 border-red-300 bg-gradient-to-r from-red-50 to-orange-50 text-red-700">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="font-bold text-lg">Late Fee Applied</p>
                      <p className="mt-1">₹5 per day after 10th of the month</p>
                      <p className="mt-1">Payment is <strong>{lateDays} day(s)</strong> late → <strong className="text-xl">Fine ₹{fine}</strong></p>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    <th className="py-3 px-4 text-left rounded-tl-lg">✔</th>
                    <th className="py-3 px-4 text-left">Item</th>
                    <th className="py-3 px-4 text-left">Frequency</th>
                    <th className="py-3 px-4 text-right">Rate</th>
                    <th className="py-3 px-4 text-right">Qty</th>
                    <th className="py-3 px-4 text-right rounded-tr-lg">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {computeFeeBreakdown().map((row, i) => (
                    <tr
                      key={i}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        row.isFine ? "bg-red-50 text-red-700 font-semibold" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={row.checked}
                          onChange={() =>
                            setSelectedFeeItems(p => ({
                              ...p,
                              [row.item]: !p[row.item]
                            }))
                          }
                          className="w-5 h-5 rounded border-gray-300"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium">{row.item}</td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                          {row.frequency}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">₹{row.amount}</td>
                      <td className="py-3 px-4 text-right">{row.qty}</td>
                      <td className="py-3 px-4 text-right font-bold">₹{row.total}</td>
                    </tr>
                  ))}

                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 font-bold text-blue-700">
                    <td colSpan={5} className="py-3 px-4 text-lg">Subtotal</td>
                    <td className="py-3 px-4 text-right text-xl">₹{totalFee}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Fee Calculation */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🧮 Fee Calculation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Total Fee</label>
              <input 
                type="number" 
                className={input} 
                value={totalFee} 
                onChange={(e) => setTotalFee(+e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Fee</label>
              <input 
                type="number" 
                className={input} 
                value={additionalFee} 
                onChange={(e) => setAdditionalFee(+e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Concession (%)</label>
              <input 
                type="number" 
                className={input} 
                value={concessionPercent} 
                onChange={(e) => { setConcessionPercent(+e.target.value); setConcessionAmt(0); }} 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Concession Amount</label>
              <input 
                type="number" 
                className={input} 
                value={concessionAmt} 
                onChange={(e) => { setConcessionAmt(+e.target.value); setConcessionPercent(0); }} 
              />
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <label className="block text-sm font-semibold text-blue-700 mb-2">Net Fee</label>
              <p className="text-2xl font-bold text-blue-600">₹{netFee}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount Received</label>
              <input 
                type="number" 
                className={input} 
                value={amountReceived} 
                onChange={(e) => setAmountReceived(+e.target.value)} 
              />
            </div>

            <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
              <label className="block text-sm font-semibold text-orange-700 mb-2">New Balance</label>
              <p className="text-2xl font-bold text-orange-600">₹{newBalance}</p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">💳 Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Mode</label>
              <select 
                className={input} 
                value={paymentMode} 
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option>Cash</option>
                <option>Cheque</option>
                <option>Online</option>
                <option>UPI</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
              <input 
                type="text" 
                className={input} 
                value={bankName} 
                onChange={(e) => setBankName(e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cheque No</label>
              <input 
                type="text" 
                className={input} 
                value={chequeNo} 
                onChange={(e) => setChequeNo(e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cheque Date</label>
              <input 
                type="date" 
                className={input} 
                value={chequeDate} 
                onChange={(e) => setChequeDate(e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Remark</label>
              <input 
                type="text" 
                className={input} 
                value={remark} 
                onChange={(e) => setRemark(e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button 
            onClick={() => window.history.back()} 
            className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
          >
            Cancel
          </button>
          <button 
            onClick={saveReceipt} 
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            💾 Save & Print
          </button>
        </div>

      </div>
    </div>
  );
}