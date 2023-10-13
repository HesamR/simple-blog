import { createContext, ReactNode, useEffect, useState } from 'react';
import { profile, ProfileOutput } from '../api/api';
import usePromise from '../hooks/usePromise';

interface IAuthContext {
  isLoggedIn: boolean;
  user?: ProfileOutput;
}

interface Props {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContext>({
  isLoggedIn: false,
});

export function AuthProvider({ children }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const profilePromise = usePromise({
    promiseFn: profile,

    onSuccess() {
      setIsLoggedIn(true);
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
        isLoggedIn,
        user: profilePromise.output,
      }}
    >
      {profilePromise.isLoading ? <p>Loading...</p> : <>{children}</>}
    </AuthContext.Provider>
  );
}

export default AuthContext;
