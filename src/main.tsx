import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './base.scss'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { HouseProvider } from './context/HouseContext.tsx'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AppointmentProvider } from './context/AppointmentContext.tsx'
import { NotesProvider } from './context/NotesContext.tsx'
import { Provider } from 'react-redux'
import store from './store.ts'
import {auth} from "./firebaseConfig.tsx";
import {loadUserCached} from "./features/users/usersSlice.ts";


 auth.onAuthStateChanged(user => {
     user && store.dispatch(loadUserCached(user))
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
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
    </Provider>
  </React.StrictMode>
)
