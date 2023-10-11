import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginOutput {
  accessToken: string;
  user: User;
}

export interface RefreshOutput {
  accessToken: string;
  user: User;
}

export interface RegisterInput {
  email: string;
  name: string;
  bio: string;
  password: string;
}

export function setAccessToken(token: string | null) {
  api.defaults.headers.common['Authorization'] = token;
}

export async function login(input?: LoginInput): Promise<LoginOutput> {
  const res = await api.post<LoginOutput>('/auth/login', input);
  return res.data;
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function refresh(): Promise<RefreshOutput> {
  const res = await api.get<RefreshOutput>('/auth/refresh');
  return res.data;
}

export async function register(input?: RegisterInput) {
  await api.post('/auth/register', input);
}
