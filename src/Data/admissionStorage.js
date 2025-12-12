const STORAGE_KEY = "school_admissions";

export function loadAdmissions() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveAdmissions(admissions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(admissions));
}
