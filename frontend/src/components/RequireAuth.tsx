import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import AuthContext from '../context/AuthContext';

function RequireAuth() {
  const { isLoggedIn, isSucceed } = useContext(AuthContext);

  return isSucceed ? (
    isLoggedIn ? (
      <Outlet />
    ) : (
      <Navigate to='/login' />
    )
  ) : (
    <p>Loading...</p>
  );
}

export default RequireAuth;
