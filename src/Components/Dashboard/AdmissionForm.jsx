// UI-only improvements applied (layout, spacing, colors, cards)
// Logic & functions are unchanged

import { loadAdmissions, saveAdmissions } from "../../Data/admissionStorage";
import { addStudent } from "../../Data/studentStorage";
import React, { useState } from "react";

export default function AdmissionForm() {
  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    class: "",
    section: "",
    session: "",
    mobile: "",
    gender: "",
    religion: "",
    category: "",
    address1: "",
    address2: "",
    city: "",
    dob: "",
    admissionDate: "",
    regNo: "",
    transport: "",
    vehicle: "",
    bloodGroup: "",
    discount: "",
    tc: "No",
    charCert: "No",
    reportCard: "No",
    dobCert: "No",
    photo: null,
  });

  function handleInput(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (file) setForm({ ...form, photo: URL.createObjectURL(file) });
  }

  function submitForm() {
    const existing = loadAdmissions();
    const newRecord = { id: Date.now(), ...form };
    saveAdmissions([...existing, newRecord]);

    addStudent({
      id: newRecord.id,
      name: newRecord.name,
      class: newRecord.class,
      section: newRecord.section,
      session: newRecord.session,
      mobile: newRecord.mobile,
      fatherName: newRecord.fatherName,
      motherName: newRecord.motherName,
      address: newRecord.address1,
      photo: newRecord.photo,
      feeStatus: "Pending",
    });

    alert("Admission Saved & Student Added Successfully!");
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-slate-700 mb-6 border-b pb-3">
          📝 New Admission Form
        </h2>

        {/* Student Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50 p-5 rounded-xl border">
          <Input label="Student Name" name="name" value={form.name} onChange={handleInput} />
          <Select label="Class" name="class" value={form.class} onChange={handleInput} options={["Nursery","KG","1","2","3","4","5","6","7","8","9","10"]} />
          <Select label="Section" name="section" value={form.section} onChange={handleInput} options={["A","B","C","D"]} />

          <Input label="Mobile" name="mobile" value={form.mobile} onChange={handleInput} />
          <Input type="date" label="DOB" name="dob" value={form.dob} onChange={handleInput} />
          <Select label="Blood Group" name="bloodGroup" value={form.bloodGroup} onChange={handleInput} options={["A+","A-","B+","B-","O+","O-","AB+","AB-"]} />

          <Input label="Father Name" name="fatherName" value={form.fatherName} onChange={handleInput} />
          <Input label="Mother Name" name="motherName" value={form.motherName} onChange={handleInput} />
          <Select label="Gender" name="gender" value={form.gender} onChange={handleInput} options={["Boy","Girl"]} />

          <Input label="Address Line 1" name="address1" value={form.address1} onChange={handleInput} />
          <Input label="Address Line 2" name="address2" value={form.address2} onChange={handleInput} />
          <Input label="City" name="city" value={form.city} onChange={handleInput} />
        </div>

        {/* Admission Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-6 bg-slate-50 p-5 rounded-xl border">
          <Input type="date" label="Admission Date" name="admissionDate" value={form.admissionDate} onChange={handleInput} />
          <Input label="Registration No" name="regNo" value={form.regNo} onChange={handleInput} />
          <Select label="Session" name="session" value={form.session} onChange={handleInput} options={["2024-25","2025-26","2026-27"]} />
          <Select label="Category" name="category" value={form.category} onChange={handleInput} options={["General","OBC","SC","ST"]} />
        </div>

        {/* Transport & Photo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 bg-slate-50 p-5 rounded-xl border">
          <Select label="Transport" name="transport" value={form.transport} onChange={handleInput} options={["Alawalpur | Rs.500","City Center | Rs.600","No Transport"]} />
          <Select label="Vehicle" name="vehicle" value={form.vehicle} onChange={handleInput} options={["Bus","Van","Auto","---"]} />

          <div>
            <label className="block font-medium mb-1">Photo</label>
            <input type="file" onChange={handlePhoto} className="text-sm" />
            {form.photo && <img src={form.photo} className="h-24 w-24 mt-2 rounded-xl border object-cover" />}
          </div>
        </div>

        {/* Documents */}
        <div className="mt-6 bg-slate-50 p-5 rounded-xl border">
          <h3 className="font-semibold mb-4 text-slate-700">📄 Documents Received</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <DocRadio label="TC" name="tc" value={form.tc} onChange={handleInput} />
            <DocRadio label="Character Cert" name="charCert" value={form.charCert} onChange={handleInput} />
            <DocRadio label="Report Card" name="reportCard" value={form.reportCard} onChange={handleInput} />
            <DocRadio label="DOB Certificate" name="dobCert" value={form.dobCert} onChange={handleInput} />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button onClick={submitForm} className="px-6 py-2 bg-emerald-600 text-white rounded-xl shadow hover:bg-emerald-700">
            Save Admission
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500" />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <select name={name} value={value} onChange={onChange}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500">
        <option value="">Select</option>
        {options.map(opt => <option key={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function DocRadio({ label, name, value, onChange }) {
  return (
    <div className="bg-white p-3 rounded-lg border">
      <div className="font-medium mb-1">{label}</div>
      <div className="flex gap-4 text-sm">
        <label><input type="radio" name={name} value="Yes" onChange={onChange} /> Yes</label>
        <label><input type="radio" name={name} value="No" onChange={onChange} /> No</label>
      </div>
    </div>
  );
}