import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
    <App />
    
      <Toaster position="top-center" reverseOrder={false} />  {/* ✅ Must be here */}
  </StrictMode>
  </BrowserRouter>
)
