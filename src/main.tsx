import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Home from './components/Home.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <Home />
  </StrictMode>
);