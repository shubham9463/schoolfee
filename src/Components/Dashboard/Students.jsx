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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Students Directory
              </h2>
              <p className="text-slate-500 mt-1">Manage and view all student records</p>
            </div>

            <div className="flex gap-3 flex-wrap">
              {/* ADD STUDENT BUTTON */}
              <button
                onClick={() => navigate("/?tab=admission")}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Student
              </button>

              {/* BULK IMPORT BUTTON */}
              <button
                onClick={() => document.getElementById("excelInput").click()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Students</p>
                  <p className="text-3xl font-bold mt-1">{students.length}</p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-4 text-white shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Classes</p>
                  <p className="text-3xl font-bold mt-1">{classes.length}</p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl p-4 text-white shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Filtered Results</p>
                  <p className="text-3xl font-bold mt-1">{filtered.length}</p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FILTER BOX */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search & Filter Students
            </h3>
          </div>

          <div className="p-6">
            {/* SEARCH BAR */}
            <div className="mb-5 relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by Name, Father's Name, Registration Number, or Mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-2 border-slate-200 pl-12 pr-4 py-3.5 rounded-xl w-full focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 text-slate-700"
              />
            </div>

            {/* DROPDOWN FILTERS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Class</label>
                <select
                  value={cls}
                  onChange={(e) => setCls(e.target.value)}
                  className="border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 font-medium text-slate-700 w-full"
                >
                  <option value="">All Classes</option>
                  {classes.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 font-medium text-slate-700 w-full"
                >
                  <option value="">All Sections</option>
                  {sections.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Session</label>
                <select
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  className="border-2 border-slate-200 px-4 py-3 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 font-medium text-slate-700 w-full"
                >
                  <option value="">All Sessions</option>
                  {sessions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={applyFilter}
                className="flex-1 min-w-[140px] px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Apply Filter
              </button>

              <button
                onClick={resetFilter}
                className="flex-1 min-w-[140px] px-6 py-3 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset All
              </button>
            </div>
          </div>
        </div>

        {/* NO TABLE UNTIL FILTER */}
        {!showTable && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-slate-300 p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Ready to Search</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Apply filters or use the search bar above, then click <span className="font-semibold text-blue-600">Apply Filter</span> to view student records.
              </p>
            </div>
          </div>
        )}

        {/* TABLE */}
        {showTable && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-700 to-slate-600 text-white">
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-left">S.No</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-left">Name</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-left">Father Name</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-left">Gender</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-left">Class</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-left">Section</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-left">Reg. No</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-left">Mobile</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-left">Photo</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-left">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {filtered.length ? (
                    filtered.map((s, index) => (
                      <tr key={s.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-150">
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full">
                            <span className="text-sm font-bold text-slate-700">{index + 1}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-800">{s.name}</div>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600">{s.fatherName}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${s.gender === 'Male' ? 'bg-blue-100 text-blue-700' : s.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-700'}`}>
                            {s.gender === 'Male' && (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            )}
                            {s.gender === 'Female' && (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            )}
                            {s.gender}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-sm font-semibold">
                            {s.class}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-semibold">
                            {s.section}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600 font-mono">{s.regNo || "--"}</td>
                        <td className="py-4 px-4 text-sm text-slate-600">{s.mobile}</td>

                        <td className="py-4 px-4">
                          {s.photo ? (
                            <img src={s.photo} className="h-14 w-14 rounded-xl object-cover border-2 border-blue-200 shadow-md" alt="Student" />
                          ) : (
                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shadow-md">
                              <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/fee-collection?student=${s.id}`)}
                              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              Fee
                            </button>

                            <button
                              onClick={() => setEditing(s)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-16">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mb-4">
                            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="font-bold text-lg text-slate-700 mb-1">No Students Found</h3>
                          <p className="text-slate-500 text-sm">Try adjusting your search criteria or filters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {editing && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6 rounded-t-2xl">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Student Details
                </h3>
                <p className="text-blue-100 text-sm mt-1">Update student information</p>
              </div>

              <div className="p-8">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Student Name</label>
                    <input
                      type="text"
                      className="border-2 border-slate-200 px-4 py-3 w-full rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      placeholder="Enter student name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Mobile Number</label>
                    <input
                      type="text"
                      className="border-2 border-slate-200 px-4 py-3 w-full rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
                      value={editing.mobile}
                      onChange={(e) => setEditing({ ...editing, mobile: e.target.value })}
                      placeholder="Enter mobile number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Class</label>
                    <select
                      className="border-2 border-slate-200 px-4 py-3 w-full rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 font-medium"
                      value={editing.class}
                      onChange={(e) => setEditing({ ...editing, class: e.target.value })}
                    >
                      {["Nursery", "KG", "1","2","3","4","5","6","7","8","9","10"].map(x => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Section</label>
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
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={() => setEditing(null)}
                    className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleEditSave}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}