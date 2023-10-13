import { useState, createContext, ReactNode, useEffect } from 'react';
import usePromise from '../hooks/usePromise';
import { RefreshOutput, User, refresh, setAccessToken } from '../api/api';
import { useInterval } from '@mantine/hooks';

interface IAuthContext {
  isLoggedIn: boolean;
  user: User;

  setIsLoggedIn: (value: boolean) => void;
  setUser: (value: User) => void;
}

interface Props {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContext>({
  isLoggedIn: false,
  user: { id: -1, email: '', role: '' },

  setIsLoggedIn(_) {
    throw new Error('unimplemented');
  },

  setUser(_) {
    throw new Error('unimplemented');
  },
});

export function AuthProvider({ children }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>({ id: -1, email: '', role: '' });

  const refreshPromise = usePromise({
    promiseFn: refresh,

    onSuccess(data: RefreshOutput) {
      setAccessToken(data.accessToken);
      setUser(data.user);
      setIsLoggedIn(true);
    },
  });

  const refreshInterval = useInterval(() => refreshPromise.call(), 300_000);

  useEffect(() => {
    isLoggedIn
      ? refreshInterval.start()
      : refreshInterval.active && refreshInterval.stop();
  }, [isLoggedIn]);

  useEffect(() => {
    refreshPromise.call();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        setIsLoggedIn,
        setUser,
      }}
    >
      {refreshPromise.isLoading ? <p>Loading...</p> : <>{children}</>}
    </AuthContext.Provider>
  );
}

export default AuthContext;
