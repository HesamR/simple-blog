import { RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import router from './router.tsx';

import { AuthProvider } from './context/AuthContext.tsx';
import LoadFallback from './components/LoadFallback.tsx';

const queryClient = new QueryClient();

function App() {
  return (
    <MantineProvider defaultColorScheme='dark'>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} fallbackElement={<LoadFallback />} />
        </AuthProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
