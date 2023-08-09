import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { HouseProvider } from './context/HouseContext.tsx'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AppointmentProvider } from './context/AppointmentContext.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <AuthProvider>
          <HouseProvider>
            <AppointmentProvider>
              <App />
            </AppointmentProvider>
          </HouseProvider>
        </AuthProvider>
      </BrowserRouter>
     </LocalizationProvider>
   </React.StrictMode>
)
