// dummy fee records per student (can hold multiple months)
export let feeRecords = [
  { id: 1, studentId: 1, month: "April", session: "2024-25", total: 2000, paid: 1500, pending: 500, date: "2025-04-05", status: "Partial" },
  { id: 2, studentId: 2, month: "April", session: "2024-25", total: 2000, paid: 2000, pending: 0,   date: "2025-04-04", status: "Paid" },
  { id: 3, studentId: 3, month: "April", session: "2024-25", total: 2000, paid:    0, pending: 2000, date: "2025-04-01", status: "Pending" },
  { id: 4, studentId: 1, month: "May",   session: "2024-25", total: 2000, paid:    0, pending: 2000, date: "2025-05-03", status: "Pending" }
];

// helper to update fees in-memory (used by Fees.jsx)
export function collectPayment(recordId, amount) {
  const idx = feeRecords.findIndex(r => r.id === recordId);
  if (idx === -1) return null;
  feeRecords[idx].paid += amount;
  feeRecords[idx].pending = Math.max(0, feeRecords[idx].total - feeRecords[idx].paid);
  feeRecords[idx].status = feeRecords[idx].pending === 0 ? "Paid" : (feeRecords[idx].paid === 0 ? "Pending" : "Partial");
  // update date to now
  feeRecords[idx].date = new Date().toISOString().slice(0,10);
  return feeRecords[idx];
}
