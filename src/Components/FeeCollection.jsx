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

  useEffect(() => {
    // load fee structure (localStorage). If not present initialize empty for classes.
    const raw = localStorage.getItem(FEE_KEY);
    setFeeStructure(raw ? JSON.parse(raw) : {});
  }, []);

  useEffect(() => {
    // load student
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

  // month count affects base total calculation (only monthly items are multiplied)
  function getMonthCount() {
    return Object.values(selectedMonths).filter(Boolean).length;
  }

  function getClassFees() {
    if (!student) return [];
    const clsKey = String(student.class);
    return (feeStructure[clsKey] || feeStructure[student.class] || []);
  }

  // compute displayed fee breakdown (based on selected months)
  function computeFeeBreakdown() {
    const items = getClassFees();
    const months = getMonthCount();
    return items.map(it => {
      let qty = 1;
      if (!months) { // if no months selected, still show 1 for one-time items; monthly will be 0
        qty = it.frequency === "Monthly" ? 0 : 1;
      } else {
        qty = it.frequency === "Monthly" ? months : 1;
      }
      return { ...it, qty, total: (it.amount || 0) * qty };
    });
  }

  // calculate totals
  useEffect(() => {
    const breakdown = computeFeeBreakdown();
    const base = breakdown.reduce((s, i) => s + i.total, 0);
    setTotalFee(base);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeStructure, student, selectedMonths]);

  useEffect(() => {
    const total = totalFee + (additionalFee || 0);
    const concession = concessionAmt || (total * (concessionPercent || 0) / 100);
    const net = total - concession + (oldBalance || 0);
    setNetFee(net);
    setNewBalance(net - (amountReceived || 0));
  }, [totalFee, additionalFee, concessionPercent, concessionAmt, oldBalance, amountReceived]);

  const input = "border border-slate-300 px-2 py-1 text-sm rounded w-full";

  if (!student) {
    return <div className="h-screen flex items-center justify-center text-xl font-semibold">Student Not Found</div>;
  }

  // Save receipt
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
      feeBreakdown: computeFeeBreakdown(),
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
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-4">

        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <h2 className="text-lg font-bold">Fee Collection</h2>
          <button onClick={() => window.history.back()} className="text-sm bg-slate-500 text-white px-3 py-1 rounded">Back</button>
        </div>

        {/* photo + info */}
        <div className="flex gap-4 mb-4">
          <div>
            {student.photo ? (
              <img src={student.photo} className="h-28 w-28 rounded-md object-cover border" alt="student"/>
            ) : (
              <div className="h-28 w-28 rounded-md bg-slate-300 flex items-center justify-center text-2xl font-bold text-slate-700">
                {String(student.name || " ")[0]}
              </div>
            )}
          </div>

          <table className="text-sm w-full">
            <tbody>
              <tr><td className="font-semibold pr-2">Name:</td><td>{student.name}</td><td className="font-semibold pr-2">Class:</td><td>{student.class}-{student.section}</td></tr>
              <tr><td className="font-semibold pr-2">Father:</td><td>{student.fatherName}</td><td className="font-semibold pr-2">Reg No:</td><td>{student.regNo}</td></tr>
              <tr><td className="font-semibold pr-2">Mobile:</td><td>{student.mobile}</td><td className="font-semibold pr-2">SID:</td><td>{student.id}</td></tr>
              <tr><td className="font-semibold pr-2">Old Balance:</td><td>₹{oldBalance}</td><td className="font-semibold pr-2">Date:</td><td>{paymentDate}</td></tr>
              <tr><td className="font-semibold pr-2">Address:</td><td colSpan={3}>{student.address}</td></tr>
            </tbody>
          </table>
        </div>

        {/* months */}
        <div className="bg-slate-50 p-3 rounded border mb-3 text-sm">
          <b>Month Selection</b>
          <div className="flex flex-wrap gap-3 mt-2">
            <label>
              <input type="checkbox" checked={selectAll} onChange={() => {
                const v = !selectAll;
                setSelectAll(v);
                setSelectedMonths(Object.fromEntries(Object.keys(selectedMonths).map(m => [m, v])));
              }} /> Select All
            </label>

            {Object.keys(selectedMonths).map(m => (
              <label key={m}>
                <input type="checkbox" checked={selectedMonths[m]} onChange={() => setSelectedMonths(p => ({ ...p, [m]: !p[m] }))} /> {m}
              </label>
            ))}
          </div>

          {Object.values(selectedMonths).includes(true) && (
            <button onClick={() => setShowFeeTable(true)} className="mt-3 bg-blue-600 text-white px-4 py-1 rounded text-sm">Show Fee Structure</button>
          )}
        </div>

        {/* class-based fee structure */}
        {showFeeTable && (
          <div className="mt-2 border rounded bg-white p-3 shadow text-sm mb-4">
            <h3 className="font-bold mb-2 text-slate-700">Fee Structure for {student.class}</h3>

            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-1">Item</th>
                  <th className="py-1">Frequency</th>
                  <th className="py-1 text-right">Rate</th>
                  <th className="py-1 text-right">Qty</th>
                  <th className="py-1 text-right">Total</th>
                </tr>
              </thead>

              <tbody>
                {computeFeeBreakdown().map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-1">{row.item}</td>
                    <td className="py-1">{row.frequency}</td>
                    <td className="py-1 text-right">₹{row.amount}</td>
                    <td className="py-1 text-right">{row.qty}</td>
                    <td className="py-1 text-right">₹{row.total}</td>
                  </tr>
                ))}

                <tr className="font-bold text-blue-600">
                  <td className="py-1">Subtotal</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="py-1 text-right">₹{totalFee}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* fees inputs */}
        <div className="grid grid-cols-4 gap-3 text-sm mb-4">
          <div>
            <label>Total Fee</label>
            <input type="number" className={input} value={totalFee} onChange={(e) => setTotalFee(+e.target.value)} />
          </div>

          <div>
            <label>Additional</label>
            <input type="number" className={input} value={additionalFee} onChange={(e) => setAdditionalFee(+e.target.value)} />
          </div>

          <div>
            <label>Concession (%)</label>
            <input type="number" className={input} value={concessionPercent} onChange={(e) => { setConcessionPercent(+e.target.value); setConcessionAmt(0); }} />
          </div>

          <div>
            <label>Concession Amt</label>
            <input type="number" className={input} value={concessionAmt} onChange={(e) => { setConcessionAmt(+e.target.value); setConcessionPercent(0); }} />
          </div>

          <div>
            <label>Net Fee</label>
            <input type="number" className={input} readOnly value={netFee} />
          </div>

          <div>
            <label>Amount Received</label>
            <input type="number" className={input} value={amountReceived} onChange={(e) => setAmountReceived(+e.target.value)} />
          </div>

          <div>
            <label>New Balance</label>
            <input type="number" className={input} readOnly value={newBalance} />
          </div>
        </div>

        {/* payment details */}
        <div className="grid grid-cols-5 gap-3 text-sm bg-slate-50 p-3 rounded border mb-4">
          <div>
            <label>Mode</label>
            <select className={input} value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
              <option>Cash</option>
              <option>Cheque</option>
              <option>Online</option>
              <option>UPI</option>
            </select>
          </div>

          <div>
            <label>Bank</label>
            <input type="text" className={input} value={bankName} onChange={(e) => setBankName(e.target.value)} />
          </div>

          <div>
            <label>Cheque No</label>
            <input type="text" className={input} value={chequeNo} onChange={(e) => setChequeNo(e.target.value)} />
          </div>

          <div>
            <label>Cheque Date</label>
            <input type="date" className={input} value={chequeDate} onChange={(e) => setChequeDate(e.target.value)} />
          </div>

          <div>
            <label>Remark</label>
            <input type="text" className={input} value={remark} onChange={(e) => setRemark(e.target.value)} />
          </div>
        </div>

        {/* actions */}
        <div className="flex justify-end gap-2">
          <button onClick={() => window.history.back()} className="bg-slate-400 text-white px-4 py-1 rounded text-sm">Cancel</button>
          <button onClick={saveReceipt} className="bg-green-600 text-white px-4 py-1 rounded text-sm">Save & Print</button>
        </div>

      </div>
    </div>
  );
}
