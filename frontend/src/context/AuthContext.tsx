import { useState, createContext, ReactNode, useEffect } from 'react';
import usePromise from '../hooks/usePromise';
import { RefreshOutput, User, refresh, setAccessToken } from '../api/api';
import { useInterval } from '@mantine/hooks';

interface IAuthContext {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;

  user: User;
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
    console.log('login on startup');
    refreshPromise.call();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
