import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { installAuthInterceptor } from './api/session'

// Registered once, before anything renders, so every dashboard request gets
// the expired-session handling.
installAuthInterceptor()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
