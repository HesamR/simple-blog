import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:3000/api/v1' : 'api/v1',
  withCredentials: true,
});

export interface LoginInput {
  email: string;
  password: string;
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

export interface ChangeEmailInput {
  email: string;
}

export interface ProfileOutput {
  id: number;
  email: string;
  name: string;
  bio: string;
  expiresAt: number;
}

export interface ProfileByIdOutput {
  name: string;
  bio: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export interface EditProfileInput {
  name: string;
  bio: string;
}

export interface CreateArticleInput {
  title: string;
  summery: string;
  content: string;
}

export interface CreateArticleOutput {
  id: number;
  userId: number;
}

export interface EditArticleInput {
  articleId: number;
  title?: string;
  summery?: string;
  content?: string;
}

export interface Article {
  id: number;
  title: string;
  summery: string;
  content: string;
  createAt: string;
  updateAt: string;
  user: {
    profile: {
      id: number;
      name: string;
    };
  };
}
export interface UserArticle {
  id: number;
  title: string;
  summery: string;
  content: string;
  createAt: string;
  updateAt: string;
  userId: string;
}

export interface ArticlePartial {
  id: number;
  title: string;
  summery: string;
  createAt: string;
  updateAt: string;
  user: {
    profile: {
      id: number;
      name: string;
    };
  };
}

export interface ArticlePartial2 {
  id: number;
  title: string;
  summery: string;
  createAt: string;
  updateAt: string;
}

export interface DeleteArticleInput {
  articleId: number;
}

export async function login(input: LoginInput): Promise<void> {
  return api.post('/auth/login', input);
}

export async function logout(): Promise<void> {
  return api.post('/auth/logout');
}

export async function register(input: RegisterInput): Promise<void> {
  return api.post('/auth/register', input);
}

export async function verifyEmail(input: VerifyEmailInput): Promise<boolean> {
  const res = await api.post('/auth/verify-email', input);
  return res.data;
}

export async function forgetPassword(
  input: ForgetPasswordInput,
): Promise<void> {
  return api.post('/auth/forget-password', input);
}

export async function forgetPasswordComplete(
  input: ForgetPasswordCompleteInput,
): Promise<boolean> {
  const res = await api.post('/auth/forget-password-complete', input);
  return res.data;
}

export async function isEmailVerified(): Promise<boolean> {
  const res = await api.get('/auth/is-email-verified');
  return res.data;
}

export async function sendVerifyEmail(): Promise<void> {
  return api.post('/auth/send-verify-email');
}

export async function changeEmail(input: ChangeEmailInput): Promise<void> {
  return api.post('/auth/change-email', input);
}

export async function changePassword(
  input?: ChangePasswordInput,
): Promise<void> {
  return api.post('/auth/change-password', input);
}

export async function getCurrentUser(): Promise<ProfileOutput> {
  const res = await api.get('/user/current');
  return res.data;
}

export async function getProfileById(id: number): Promise<ProfileByIdOutput> {
  const res = await api.get(`/user/profile/${id}`);
  return res.data;
}

export async function editProfile(input: EditProfileInput): Promise<void> {
  return api.post('/user/edit', input);
}

export async function createArticle(
  input: CreateArticleInput,
): Promise<CreateArticleOutput> {
  const res = await api.post('/article/create', input);
  return res.data;
}

export async function editArticle(input: EditArticleInput): Promise<void> {
  return api.post('/article/edit', input);
}

export async function getMyArticles(): Promise<ArticlePartial2[]> {
  const res = await api.get('/article/current-user');
  return res.data;
}

export async function getMyArticleById(id: number): Promise<UserArticle> {
  const res = await api.get(`/article/current-user/${id}`);
  return res.data;
}

export async function getAllArticles(): Promise<ArticlePartial[]> {
  const res = await api.get('/article/all');
  return res.data;
}

export async function getArticleById(id: number): Promise<Article> {
  const res = await api.get(`/article/${id}`);
  return res.data;
}

export async function getUserArticles(
  userId: number,
): Promise<ArticlePartial2[]> {
  const res = await api.get(`/article/user/${userId}`);
  return res.data;
}

export async function deleteArticle(input: DeleteArticleInput): Promise<void> {
  return api.post('/article/delete', input);
}
