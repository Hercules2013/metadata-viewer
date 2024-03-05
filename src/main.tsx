import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import './index.scss';

import '@fontsource-variable/dm-sans';

import 'react-perfect-scrollbar/dist/css/styles.css';

import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: `'DM Sans Variable', sans-serif;`,
    body: `'DM Sans Variable', sans-serif;`,
  },
  colors: {
    blue: {
      '50': '#f2f8ff',
      '100': '#cae3ff',
      '200': '#9bc9ff',
      '300': '#5fa9ff',
      '400': '#3b95ff',
      '500': '#0577fe',
      '600': '#0465d6',
      '700': '#0351ad',
      '800': '#034592',
      '900': '#02326a',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
