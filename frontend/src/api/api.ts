import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:3000/api/v1' : 'api/v1',
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
}

export interface LoginOutput {
  user: User;
  expiresAt: number;
}

export interface RegisterInput {
  email: string;
  name: string;
  bio: string;
  password: string;
}

export interface VerifyEmailInput {
  token: string;
}

export interface ForgetPasswordInput {
  email: string;
}

export interface ForgetPasswordCompleteInput {
  token: string;
  newPassword: string;
}

export async function login(input?: LoginInput): Promise<LoginOutput> {
  const res = await api.post<LoginOutput>('/auth/login', input);
  return res.data;
}

export async function logout(): Promise<void> {
  return api.post('/auth/logout');
}

export async function register(input?: RegisterInput): Promise<void> {
  return api.post('/auth/register', input);
}

export async function verifyEmail(input?: VerifyEmailInput): Promise<boolean> {
  const res = await api.post('/auth/verify-email', input);
  return res.data;
}

export async function forgetPassword(
  input?: ForgetPasswordInput,
): Promise<void> {
  return api.post('/auth/forget-password', input);
}

export async function forgetPasswordComplete(
  input?: ForgetPasswordCompleteInput,
): Promise<boolean> {
  const res = await api.post('/auth/forget-password-complete', input);
  return res.data;
}

export async function isEmailVerified(): Promise<boolean> {
  const res = await api.get('/auth/is-email-verified');
  return res.data;
}

export async function sendVerifyEmail(): Promise<void> {
  return api.post('auth/send-verify-email');
}
