/**
 * localStorage student store — cache / fallback when MongoDB unavailable
 */
const KEY = 'gci_students';

export function getAllStudents() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function getStudentById(id) {
  if (!id) return null;
  const s = String(id);
  return getAllStudents().find(r => String(r.id) === s || String(r._id) === s) || null;
}

export function saveStudent(data) {
  const list = getAllStudents();
  // Preserve the server-assigned id (MongoDB _id or local id)
  const id = String(data._id || data.id || Date.now());
  const idx = list.findIndex(r => String(r.id) === id || String(r._id) === id);
  const student = {
    ...data,
    id,
    submittedAt: data.submittedAt || data.createdAt || new Date().toISOString(),
    status: data.status || 'Pending',
  };
  if (idx >= 0) { list[idx] = student; } else { list.push(student); }
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
  return student;
}

export function updateStudentStatus(id, status) {
  const s = String(id);
  const list = getAllStudents().map(r =>
    (String(r.id) === s || String(r._id) === s) ? { ...r, status } : r
  );
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

export function deleteStudent(id) {
  const s = String(id);
  const list = getAllStudents().filter(r => String(r.id) !== s && String(r._id) !== s);
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}
