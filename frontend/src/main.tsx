import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TimezoneProvider } from './context/TimezoneContext';
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <TimezoneProvider>
        <App />
      </TimezoneProvider>
    </HelmetProvider>
  </StrictMode>,
)
