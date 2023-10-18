import { createContext, ReactNode } from 'react';
import { getCurrentUser, ProfileOutput } from '../api/api';
import { useQuery } from '@tanstack/react-query';

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
  const { isSuccess, data } = useQuery({
    queryKey: ['current-user', 'get-current-user'],
    queryFn: getCurrentUser,
  });

  const isLoggedIn = () => {
    if (isSuccess) {
      return data.expiresAt > Date.now() ? true : false;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        isSucceed: isSuccess,
        isLoggedIn: isLoggedIn(),
        user: data,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
