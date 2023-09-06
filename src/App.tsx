import './App.css'
import { Route, Routes } from 'react-router-dom'
import RegisterPage from './views/Register/RegisterPage.tsx'
import LoginPage from './views/Login/LoginPage.tsx'
import HomePage from './views/Home/HomePage.tsx'
import ResetPassword from './views/ResetPassword/ResetPassword.tsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx'
import { ProtectedRouteProps } from './components/ProtectedRoute/ProtectedRoute.tsx'
import AccountPage from './views/Account/AccountPage.tsx'
import NoHouse from './views/NoHouse/NoHouse.tsx'
import MyHouse from './views/MyHouse/MyHouse.tsx'
import { AppointmentType } from './AppointmentType.tsx'
import AppointmentsPage from './views/Appointments/AppointmentsPage.tsx'
import NotesPage from './views/Notes/NotesPage.tsx'
import LandingPage from './views/Landing/LandingPage.tsx'


function App() {

  const authRequiredNoHouseProps: Omit<ProtectedRouteProps, 'component'> = {
    redirectPathAuthCondition: '/login',
    redirectPathHouseCondition: '/today',
    requiresLoggedIn: true,
    requiresHouseJoined: false,
    isAccount: false
  };

  const authRequiredJoinedHouseProps: Omit<ProtectedRouteProps, 'component'> = {
    redirectPathAuthCondition: '/login',
    redirectPathHouseCondition: '/nohouse',
    requiresLoggedIn: true,
    requiresHouseJoined: true,
    isAccount: false,
  };

  const notAuthRequiredProps: Omit<ProtectedRouteProps, 'component'> = {
    redirectPathAuthCondition: '/today',
    redirectPathHouseCondition: '/today',
    requiresLoggedIn: false,
    requiresHouseJoined: false,
    isAccount: false
  };

  const authRequiredIsAccountProps: Omit<ProtectedRouteProps, 'component'> = {
    redirectPathAuthCondition: '/login',
    redirectPathHouseCondition: '/today',
    requiresLoggedIn: true,
    requiresHouseJoined: false,
    isAccount: true
  };

  const landingProps: Omit<ProtectedRouteProps, 'component'> = {
    redirectPathAuthCondition: '/today',
    redirectPathHouseCondition: '/',
    requiresLoggedIn: false,
    requiresHouseJoined: false,
    isAccount: false
  };
  
  return (
    <>
    <Routes>
    <Route path='/' element={<ProtectedRoute {...landingProps} component={<LandingPage />} />} />
      <Route path='/today' element={<ProtectedRoute {...authRequiredJoinedHouseProps} component={<HomePage />} />} />
      <Route path='/myhouse' element={<ProtectedRoute {...authRequiredJoinedHouseProps} component={<MyHouse />} />} />
      <Route path='/kitchen' element={<ProtectedRoute {...authRequiredJoinedHouseProps} component={<AppointmentsPage appointmentType={AppointmentType.kitchen} />} />} />
      <Route path='/bathroom' element={<ProtectedRoute {...authRequiredJoinedHouseProps} component={<AppointmentsPage appointmentType={AppointmentType.bathroom} />} />} />
      <Route path='/notes' element={<ProtectedRoute {...authRequiredJoinedHouseProps} component={<NotesPage />} />} />

      <Route path="/account" element={<ProtectedRoute {...authRequiredIsAccountProps} component={<AccountPage />} />} />

      <Route path="/register" element={<ProtectedRoute {...notAuthRequiredProps} component={<RegisterPage />} />} />
      <Route path="/login" element={<ProtectedRoute {...notAuthRequiredProps} component={<LoginPage />} />} />
      <Route path="/resetpassword" element={<ProtectedRoute {...notAuthRequiredProps} component={<ResetPassword />} />} />

      <Route path='/nohouse' element={<ProtectedRoute {...authRequiredNoHouseProps} component={<NoHouse />} />} />
    </Routes>
    </>
  )
}

export default App
