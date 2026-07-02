/**
 * apiClient.js
 *
 * Thin wrapper around fetch() that:
 *   1. Adds x-user-id header automatically from localStorage
 *   2. Throws a readable Error when the server returns an error shape
 *   3. Supports a Mode flag: 'local' (localStorage) or 'api' (MongoDB)
 *
 * To switch to full backend mode set NEXT_PUBLIC_AUTH_MODE=api in .env.local
 */

export const MODE = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_AUTH_MODE === 'api'
  ? 'api'
  : 'local';

function getStoredUser() {
  try {
    const s = localStorage.getItem('gci_user');
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export async function apiFetch(path, options = {}) {
  const user = getStoredUser();
  const headers = {
    'Content-Type': 'application/json',
    ...(user?.id ? { 'x-user-id': user.id } : {}),
    ...options.headers,
  };

  const res = await fetch(path, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

/* ── Admission helpers ── */

export async function createAdmission(formData) {
  return apiFetch('/api/admission', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

export async function fetchAllAdmissions({ status, course, q } = {}) {
  const params = new URLSearchParams();
  if (status && status !== 'All') params.set('status', status);
  if (course && course !== 'All') params.set('course', course);
  if (q) params.set('q', q);
  const qs = params.toString();
  return apiFetch(`/api/admission${qs ? `?${qs}` : ''}`);
}

export async function fetchAdmission(id) {
  return apiFetch(`/api/admission/${id}`);
}

export async function updateAdmissionStatus(id, status) {
  return apiFetch(`/api/admission/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteAdmission(id) {
  return apiFetch(`/api/admission/${id}`, { method: 'DELETE' });
}

/* ── User helpers ── */

export async function fetchAllUsers() {
  return apiFetch('/api/users');
}
