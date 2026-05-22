import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#27272a',
            color: '#f4f4f5',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '13px',
            fontFamily: '"DM Sans", sans-serif',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
