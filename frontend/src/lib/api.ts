const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data?.error?.message || 'Request failed');
  }
  return data.data as T;
}
