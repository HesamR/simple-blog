import { RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';

import { AuthProvider } from './context/AuthContext.tsx';
import router from './router.tsx';
import LoadFallback from './components/LoadFallback.tsx';

function App() {
  return (
    <MantineProvider defaultColorScheme='dark'>
      <AuthProvider>
        <RouterProvider router={router} fallbackElement={<LoadFallback />} />
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
