import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import AuthContext from '../context/AuthContext';
import LoadFallback from './LoadFallback';

function RequireAuth() {
  const { isLoggedIn, isSucceed } = useContext(AuthContext);

  return isSucceed ? (
    isLoggedIn ? (
      <Outlet />
    ) : (
      <Navigate to='/login' />
    )
  ) : (
    <LoadFallback />
  );
}

export default RequireAuth;
