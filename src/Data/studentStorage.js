// src/Data/studentStorage.js

const STORAGE_KEY = "school_students";

/**
 * Load students from localStorage (returns [] if none)
 */
export function loadStudents() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

/**
 * Save full students array to localStorage
 */
export function saveStudents(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

/**
 * Add a new student record (student is an object)
 */
export function addStudent(student) {
  const current = loadStudents();
  const updated = [...current, student];
  saveStudents(updated);
  return updated;
}

/**
 * Update an existing student by id (student must contain id)
 */
export function updateStudent(updatedStudent) {
  const students = loadStudents();
  const updatedList = students.map(s => (s.id === updatedStudent.id ? updatedStudent : s));
  saveStudents(updatedList);
  return updatedList;
}

/**
 * Delete a student by id
 */
export function deleteStudent(id) {
  const students = loadStudents();
  const updatedList = students.filter(s => s.id !== id);
  saveStudents(updatedList);
  return updatedList;
}
