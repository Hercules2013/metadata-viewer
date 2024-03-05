import { Box, Spinner } from '@chakra-ui/react';
import { Suspense } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';

// Create the router
const router = createHashRouter([
  { path: '/', lazy: () => import('./components/Home') },
]);

function App() {
  return (
    <Suspense
      fallback={
        <Box w="100vw" h="100vh" display="flex" alignItems="center" justifyContent="center">
          <Spinner colorScheme="blue" />
        </Box>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App; 
