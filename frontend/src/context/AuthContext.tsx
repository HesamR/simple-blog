import { createContext, ReactNode, useEffect, useState } from 'react';
import { LoginOutput, User } from '../api/api';
import { useLocalStorage } from '@mantine/hooks';

interface IAuthContext {
  isLoggedIn: boolean;
  user?: User;

  setState: (out: LoginOutput) => void;
  removeState: () => void;
}

interface Props {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContext>({
  isLoggedIn: false,

  setState() {
    throw new Error('unimplemented');
  },

  removeState() {
    throw new Error('unimplemented');
  },
});

export function AuthProvider({ children }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [expiresAt, setExpiresAt, removeExpiresAt] = useLocalStorage({
    key: 'session-expires-at',
    defaultValue: 0,
  });

  const [user, setUser, removeUser] = useLocalStorage<User>({
    key: 'user-info',
  });

  const removeState = () => {
    removeExpiresAt();
    removeUser();
  };

  const setState = (out: LoginOutput) => {
    setExpiresAt(out.expiresAt);
    setUser(out.user);
  };

  useEffect(() => {
    if (expiresAt) {
      if (expiresAt > Date.now()) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        removeState();
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [expiresAt]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        setState,
        removeState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
