import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'; // Tailwind CSS
import '@syncfusion/ej2-base/styles/material.css'; // Syncfusion base styles
import '@syncfusion/ej2-react-schedule/styles/material.css'; // Syncfusion schedule styles


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
