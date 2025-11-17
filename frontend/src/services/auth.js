import axios from 'axios';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export function setToken(token){
  localStorage.setItem('pp_token', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function getToken(){
  return localStorage.getItem('pp_token');
}

export function setRole(role){
  localStorage.setItem('pp_role', role);
}

export function getRole(){
  return localStorage.getItem('pp_role');
}

export function logout(){
  localStorage.removeItem('pp_token');
  localStorage.removeItem('pp_role');
  delete axios.defaults.headers.common['Authorization'];
}

export async function login(email, password){
  const res = await axios.post(`${API}/auth/login`, { email, password });
  return res.data;
}

export default axios;
