import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './style.css';

const rootElement = document.getElementById('app');
if (!rootElement) throw new Error('Failed to find the root element');
createRoot(rootElement).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
