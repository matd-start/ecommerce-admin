import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/* Envuelve tu App con BrowserRouter */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)
