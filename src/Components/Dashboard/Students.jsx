import React, { useState, useMemo, useEffect } from "react";
import { loadStudents, saveStudents, updateStudent } from "../../Data/studentStorage";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

export default function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(null);

  // Table hidden initially
  const [showTable, setShowTable] = useState(false);

  // Filters
  const [cls, setCls] = useState("");
  const [section, setSection] = useState("");
  const [session, setSession] = useState("");

  // Search bar
  const [search, setSearch] = useState("");

  useEffect(() => {
    setStudents(loadStudents());
  }, []);

  const classes = useMemo(() => [...new Set(students.map(s => s.class))], [students]);
  const sections = useMemo(() => [...new Set(students.map(s => s.section))], [students]);
  const sessions = useMemo(() => [...new Set(students.map(s => s.session))], [students]);

  // FILTER + SEARCH
  const filtered = students.filter(s => {
    if (cls && s.class !== cls) return false;
    if (section && s.section !== section) return false;
    if (session && s.session !== session) return false;

    if (search) {
      const term = search.toLowerCase();

      if (
        !s.name.toLowerCase().includes(term) &&
        !s.fatherName?.toLowerCase().includes(term) &&
        !(s.regNo + "").includes(term) &&
        !(s.mobile + "").includes(term)
      ) {
        return false;
      }
    }
    return true;
  });

  // Save editing
  function handleEditSave() {
    updateStudent(editing);
    setStudents(loadStudents());
    setEditing(null);
  }

  // Filter button
  function applyFilter() {
    setShowTable(true);
  }

  // Reset filters
  function resetFilter() {
    setCls("");
    setSection("");
    setSession("");
    setSearch("");
    setShowTable(false);
  }

  // ⭐ FULLY-INTEGRATED BULK IMPORT
  function handleExcelUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    let reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;

      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet → JSON rows
      const excelRows = XLSX.utils.sheet_to_json(sheet);

      // Add ID and defaults
      const newStudents = excelRows.map((row) => ({
        id: Date.now() + Math.random(),
        name: row.name || "",
        fatherName: row.fatherName || "",
        motherName: row.motherName || "",
        class: row.class || "",
        section: row.section || "",
        session: row.session || "",
        gender: row.gender || "",
        mobile: row.mobile || "",
        regNo: row.regNo || "",
        city: row.city || "",
        photo: null,
      }));

      const existing = loadStudents();
      const finalList = [...existing, ...newStudents];

      saveStudents(finalList);
      setStudents(finalList);

      alert("Bulk Import Successful!");
    };

    reader.readAsBinaryString(file);
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Students</h2>

        <div className="flex gap-3">

          {/* ADD STUDENT BUTTON */}
          <button
            onClick={() => navigate("/?tab=admission")}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
          >
            + Add Student
          </button>

          {/* BULK IMPORT BUTTON */}
          <button
            onClick={() => document.getElementById("excelInput").click()}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
          >
            Bulk Import
          </button>

          {/* HIDDEN FILE INPUT */}
          <input
            id="excelInput"
            type="file"
            accept=".xlsx"
            onChange={handleExcelUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* FILTER BOX */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">

        {/* SEARCH BAR */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search by Name / Father / Reg.No / Mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 border-slate-200 px-4 py-3 rounded-xl w-full focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200"
          />
        </div>

        {/* DROPDOWN FILTERS */}
        <div className="flex gap-3 mb-5 flex-wrap">

          <select
            value={cls}
            onChange={(e) => setCls(e.target.value)}
            className="border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 font-medium text-slate-700"
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 font-medium text-slate-700"
          >
            <option value="">Select Section</option>
            {sections.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            value={session}
            onChange={(e) => setSession(e.target.value)}
            className="border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 font-medium text-slate-700"
          >
            <option value="">Select Session</option>
            {sessions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          {/* FILTER BUTTON */}
          <button
            onClick={applyFilter}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
          >
            Filter
          </button>

          {/* RESET BUTTON */}
          <button
            onClick={resetFilter}
            className="px-6 py-3 bg-slate-500 hover:bg-slate-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
          >
            Reset
          </button>
        </div>

        {/* NO TABLE UNTIL FILTER */}
        {!showTable && (
          <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            Apply filter or search, then click <b className="text-blue-600">Filter</b>.
          </div>
        )}

        {/* TABLE */}
        {showTable && (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 bg-gradient-to-r from-slate-100 to-slate-50">
                  <th className="py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">S.No</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Name</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Father Name</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Gender</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Class</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Section</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Reg. No</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Mobile</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Photo</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {filtered.length ? (
                  filtered.map((s, index) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors duration-150">

                      <td className="py-4 px-4 text-sm font-semibold text-slate-700">{index + 1}</td>

                      <td className="py-4 px-4 text-sm font-semibold text-slate-800">{s.name}</td>
                      <td className="py-4 px-4 text-sm text-slate-600">{s.fatherName}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${s.gender === 'Male' ? 'bg-blue-100 text-blue-700' : s.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-700'}`}>
                          {s.gender}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-slate-700">{s.class}</td>
                      <td className="py-4 px-4 text-sm font-semibold text-slate-700">{s.section}</td>
                      <td className="py-4 px-4 text-sm text-slate-600">{s.regNo || "--"}</td>
                      <td className="py-4 px-4 text-sm text-slate-600">{s.mobile}</td>

                      <td className="py-4 px-4">
                        {s.photo ? (
                          <img src={s.photo} className="h-12 w-12 rounded-full object-cover border-2 border-emerald-200 shadow-sm" />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                            <span className="text-slate-500 text-xs font-semibold">No Photo</span>
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                         <button
  onClick={() => navigate(`/fee-collection?student=${s.id}`)}
  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
>
  Collect Fee
</button>

                          <button
                            onClick={() => setEditing(s)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-500 bg-slate-50">
                      <div className="font-medium text-lg">No matching students found.</div>
                      <div className="text-sm mt-1">Try adjusting your search or filters</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">

            <h3 className="text-2xl font-bold mb-6 text-slate-800">Edit Student</h3>

            <div className="space-y-4">
              <input
                type="text"
                className="border-2 border-slate-200 px-4 py-3 w-full rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="Student Name"
              />

              <input
                type="text"
                className="border-2 border-slate-200 px-4 py-3 w-full rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
                value={editing.mobile}
                onChange={(e) => setEditing({ ...editing, mobile: e.target.value })}
                placeholder="Mobile Number"
              />

              <select
                className="border-2 border-slate-200 px-4 py-3 w-full rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 font-medium"
                value={editing.class}
                onChange={(e) => setEditing({ ...editing, class: e.target.value })}
              >
                {["Nursery", "KG", "1","2","3","4","5","6","7","8","9","10"].map(x => (
                  <option key={x}>{x}</option>
                ))}
              </select>

              <select
                className="border-2 border-slate-200 px-4 py-3 w-full rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 font-medium"
                value={editing.section}
                onChange={(e) => setEditing({ ...editing, section: e.target.value })}
              >
                {["A", "B", "C", "D"].map(x => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setEditing(null)}
                className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all duration-200"
              >
                Cancel
              </button>

              <button
                onClick={handleEditSave}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}