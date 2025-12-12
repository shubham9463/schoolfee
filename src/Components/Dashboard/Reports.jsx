import React from "react";
import { feeRecords } from "../../Data/fees";
import jsPDF from "jspdf";

export default function Reports() {
  const totalCollection = feeRecords.reduce((s, r) => s + r.paid, 0);
  const totalPending = feeRecords.reduce((s, r) => s + r.pending, 0);

  function exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("SchoolFee - Monthly Summary", 14, 20);
    doc.setFontSize(11);
    doc.text(`Total Collection: ₹ ${totalCollection}`, 14, 32);
    doc.text(`Total Pending: ₹ ${totalPending}`, 14, 40);

    // small table
    let y = 55;
    doc.setFontSize(10);
    doc.text("Student", 14, y);
    doc.text("Month", 80, y);
    doc.text("Paid", 130, y);
    y += 6;
    feeRecords.forEach(r => {
      const sid = r.studentId;
      doc.text(String(sid), 14, y);
      doc.text(r.month, 80, y);
      doc.text(String(r.paid), 130, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 20; }
    });

    doc.save("monthly-summary.pdf");
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold text-slate-800">Reports</h2>

      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Monthly Summary</div>
            <div className="text-2xl font-bold">₹ {totalCollection}</div>
            <div className="text-sm text-slate-400">Pending: ₹ {totalPending}</div>
          </div>

          <div>
            <button onClick={exportPDF} className="px-4 py-2 bg-emerald-500 text-white rounded">Export PDF</button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Daily Summary (Last entries)</h3>
          <ul className="divide-y">
            {feeRecords.slice(-5).reverse().map(r => (
              <li key={r.id} className="py-2 flex justify-between">
                <span>Student #{r.studentId} • {r.month}</span>
                <span>Paid ₹ {r.paid} • {r.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
