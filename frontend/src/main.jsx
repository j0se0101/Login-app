import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import App from './App'
import './index.css'
import { Toaster } from 'sonner'
import ThemeToggle from './components/ThemeToggle'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <ThemeToggle />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  </React.StrictMode>
)
