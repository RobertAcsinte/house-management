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
import { NotesProvider } from './context/NotesContext.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <AuthProvider>
          <HouseProvider>
            <AppointmentProvider>
              <NotesProvider>
                <App />
              </NotesProvider>
            </AppointmentProvider>
          </HouseProvider>
        </AuthProvider>
      </BrowserRouter>
     </LocalizationProvider>
  </React.StrictMode>
)
