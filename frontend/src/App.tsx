import { RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';

import { AuthProvider } from './context/AuthContext.tsx';
import router from './router.tsx';

function App() {
  return (
    <AuthProvider>
      <MantineProvider defaultColorScheme='dark'>
        <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
      </MantineProvider>
    </AuthProvider>
  );
}

export default App;
