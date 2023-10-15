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

const routes: RouteObject[] = [
  { path: '/', Component: HomePage },
  { path: '/login', Component: LoginPage },
  { path: '/register', Component: RegisterPage },
  { path: '/verify-email', Component: VerifyEmailPage },
  { path: '/forget-password', Component: ForgetPasswordPage },
  { path: '/forget-password-complete', Component: ForgetPasswordCompletePage },
];

const protectedRoutes: RouteObject[] = [
  { path: '/setting', Component: SettingPage },
  { path: '/create-article', Component: CreateArticlePage },
  { path: '/edit-article/:id', Component: EditArticlePage },
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
