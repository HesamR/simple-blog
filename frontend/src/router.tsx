import { RouteObject, createBrowserRouter } from 'react-router-dom';

import RequireAuth from './components/RequireAuth';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ErrorPage from './pages/ErrorPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgetPasswordPage from './pages/ForgetPasswordPage';
import ForgetPasswordCompletePage from './pages/ForgetPasswordCompletePage';
import SettingPage from './pages/SettingPage';
import CreateArticlePage from './pages/CreateArticlePage';
import EditArticlePage from './pages/EditArticlePage';
import ArticlePage from './pages/ArticlePage';
import MyArticlePage from './pages/MyArticlePage';
import UserPage from './pages/UserPage';

const routes: RouteObject[] = [
  { path: '/', Component: HomePage },
  { path: '/login', Component: LoginPage },
  { path: '/register', Component: RegisterPage },
  { path: '/verify-email', Component: VerifyEmailPage },
  { path: '/forget-password', Component: ForgetPasswordPage },
  { path: '/forget-password-complete', Component: ForgetPasswordCompletePage },
  { path: '/article', Component: ArticlePage },
  { path: '/user', Component: UserPage },
];

const protectedRoutes: RouteObject[] = [
  { path: '/setting', Component: SettingPage },
  { path: '/create-article', Component: CreateArticlePage },
  { path: '/edit-article', Component: EditArticlePage },
  { path: '/my-articles', Component: MyArticlePage },
];

const requireAuthRoute: RouteObject = {
  Component: RequireAuth,
  children: protectedRoutes,
};

const main: RouteObject = {
  Component: MainLayout,
  errorElement: <ErrorPage />,
  children: [...routes, requireAuthRoute],
};

const router = createBrowserRouter([main]);

export default router;
