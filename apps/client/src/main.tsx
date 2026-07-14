import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './services/AuthContext';
import { ThemeProvider } from './services/ThemeContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);