import { RouteObject, createBrowserRouter } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ErrorPage from './pages/ErrorPage';
import Register from './pages/Register';

const routes: RouteObject[] = [
  { path: '/', Component: HomePage },
  { path: '/login', Component: LoginPage },
  { path: '/register', Component: Register },
];

const main: RouteObject = {
  Component: MainLayout,
  errorElement: <ErrorPage />,
  children: routes,
};

const router = createBrowserRouter([main]);

export default router;
