import { createContext, ReactNode, useEffect, useState } from 'react';
import { currentUser, ProfileOutput } from '../api/api';
import usePromise from '../hooks/usePromise';

interface IAuthContext {
  isLoggedIn: boolean;
  isSucceed: boolean;
  user?: ProfileOutput;
}

interface Props {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContext>({
  isLoggedIn: false,
  isSucceed: false,
});

export function AuthProvider({ children }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const profilePromise = usePromise({
    promiseFn: currentUser,

    onSuccess(out) {
      if (out.expiresAt > Date.now()) {
        setIsLoggedIn(true);
      }
    },

    onError() {
      setIsLoggedIn(false);
    },
  });

  useEffect(() => {
    profilePromise.call();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isSucceed: profilePromise.isSuccess,
        isLoggedIn,
        user: profilePromise.output,
      }}
    >
      {profilePromise.isLoading ? <p>Loading...</p> : <>{children}</>}
    </AuthContext.Provider>
  );
}

export default AuthContext;
