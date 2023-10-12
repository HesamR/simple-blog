import { RouteObject, createBrowserRouter } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ErrorPage from './pages/ErrorPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgetPasswordPage from './pages/ForgetPasswordPage';
import ForgetPasswordCompletePage from './pages/ForgetPasswordCompletePage';
import SettingPage from './pages/SettingPage';

const routes: RouteObject[] = [
  { path: '/', Component: HomePage },
  { path: '/login', Component: LoginPage },
  { path: '/register', Component: RegisterPage },
  { path: '/setting', Component: SettingPage },
  { path: '/verify-email', Component: VerifyEmailPage },
  { path: '/forget-password', Component: ForgetPasswordPage },
  { path: '/forget-password-complete', Component: ForgetPasswordCompletePage },
];

const main: RouteObject = {
  Component: MainLayout,
  errorElement: <ErrorPage />,
  children: routes,
};

const router = createBrowserRouter([main]);

export default router;
