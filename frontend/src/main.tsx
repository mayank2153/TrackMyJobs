import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Explicitly define the type for the root element to avoid null errors
const rootElement = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
