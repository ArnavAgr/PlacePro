import axios from 'axios';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const instance = axios.create({
  baseURL: API,
});

export function setToken(token) {
  localStorage.setItem('pp_token', token);
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function getToken() {
  return localStorage.getItem('pp_token');
}

export function setRole(role) {
  localStorage.setItem('pp_role', role);
  window.dispatchEvent(new Event('auth-change'));
}

export function getRole() {
  return localStorage.getItem('pp_role');
}

export function logout() {
  localStorage.removeItem('pp_token');
  localStorage.removeItem('pp_role');
  delete instance.defaults.headers.common['Authorization'];
  window.dispatchEvent(new Event('auth-change'));
}

export async function login(email, password) {
  const res = await instance.post('/auth/login', { email, password });
  return res.data;
}

// Initialize token from local storage on load
const token = localStorage.getItem('pp_token');
if (token) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default instance;
