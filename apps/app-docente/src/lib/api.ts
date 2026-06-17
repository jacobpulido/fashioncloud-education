const API_BASE = import.meta.env.VITE_API_URL || 'https://fashioncloud-education-api.vercel.app';

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  rol: string;
}

export interface AuthResponse {
  accessToken: string;
  usuario: User;
}

function getToken(): string | null {
  return localStorage.getItem('fc_token');
}

function setToken(t: string) { localStorage.setItem('fc_token', t); }
function clearToken() { localStorage.removeItem('fc_token'); }

export function getStoredUser(): User | null {
  const raw = localStorage.getItem('fc_user');
  return raw ? JSON.parse(raw) : null;
}
export function storeUser(u: User) { localStorage.setItem('fc_user', JSON.stringify(u)); }
export function clearStoredUser() { localStorage.removeItem('fc_user'); }

export function logout() { clearToken(); clearStoredUser(); }

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers as Record<string, string> || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (res.status === 401) { logout(); window.location.href = '/login'; throw new Error('Sesión expirada'); }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || body.error || `Error ${res.status}`);
  }
  return res.json();
}

// Auth
export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/api/v1/auth/login', {
    method: 'POST', body: JSON.stringify({ email, password }),
  });
  setToken(data.accessToken);
  storeUser(data.usuario);
  return data;
}

export async function register(dto: { email: string; password: string; nombre: string; institucion_id: string }) {
  return request<AuthResponse>('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(dto) });
}

// Actividades
export async function getActividades(materiaId: string) {
  return request<any[]>(`/api/v1/actividades/materia/${materiaId}`);
}

export async function getActividad(id: string) {
  return request<any>(`/api/v1/actividades/materia/${id}/detalle`);
}

// Materias
export async function getMisMaterias() {
  return request<any[]>('/api/v1/materias');
}
