import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TimezoneProvider } from './context/TimezoneContext';
import { Analytics } from '@vercel/analytics/react';
import { createHead, UnheadProvider } from '@unhead/react/client';

const head = createHead();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <TimezoneProvider>
        <Analytics />
        <UnheadProvider head={head}>
          <App />
        </UnheadProvider>
      </TimezoneProvider>
  </StrictMode>,
)
