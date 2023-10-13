import { useContext } from 'react';
import { Outlet } from 'react-router-dom';

import AuthContext from '../context/AuthContext';

function RequireAuth() {
  const { isLoggedIn } = useContext(AuthContext);

  return isLoggedIn ? (
    <Outlet />
  ) : (
    <p>
      You must be logged in to access this page. <a href='/login'>Login</a>
    </p>
  );
}

export default RequireAuth;
