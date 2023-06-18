import './App.css'
import { Route, Routes } from 'react-router-dom'
import RegisterPage from './views/Register/RegisterPage.tsx'
import LoginPage from './views/Login/LoginPage.tsx'
import HomePage from './views/Home/HomePage.tsx'
import ResetPassword from './views/ResetPassword/ResetPassword.tsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx'
import { ProtectedRouteProps } from './components/ProtectedRoute/ProtectedRoute.tsx'
import AccountPage from './views/Account/AccountPage.tsx'


function App() {

  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'component'> = {
    authenticationPath: '/login',
    requiresLoggedIn: true
  };

  const authProtectedRouteProps: Omit<ProtectedRouteProps, 'component'> = {
    authenticationPath: '/',
    requiresLoggedIn: false
  };
  
  return (
    <>
    <Routes>
      <Route path='/' element={<ProtectedRoute {...defaultProtectedRouteProps} component={<HomePage />} />} />
      <Route path="/register" element={<ProtectedRoute {...authProtectedRouteProps} component={<RegisterPage />} />} />
      <Route path="/login" element={<ProtectedRoute {...authProtectedRouteProps} component={<LoginPage />} />} />
      <Route path="/resetpassword" element={<ProtectedRoute {...authProtectedRouteProps} component={<ResetPassword />} />} />
      <Route path="/account" element={<ProtectedRoute {...defaultProtectedRouteProps} component={<AccountPage />} />} />
    </Routes>
    </>
  )
}

export default App
