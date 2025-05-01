// src/pages/_app.tsx
import '../styles/globals.css'; // Adjust path if needed
import type { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';
import axios from 'axios';

// Set the default base URL for axios
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}