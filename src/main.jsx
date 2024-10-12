import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './assets/style.scss'

createRoot(document.getElementById('container')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
