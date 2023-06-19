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


function App() {

  const authRequiredNoHouseProps: Omit<ProtectedRouteProps, 'component'> = {
    redirectPath: '/login',
    requiresLoggedIn: true,
    requiresHouseJoined: false
  };

  const authRequiredJoinedHouseProps: Omit<ProtectedRouteProps, 'component'> = {
    redirectPath: '/login',
    requiresLoggedIn: true,
    requiresHouseJoined: true
  };

  const notAuthRequiredProps: Omit<ProtectedRouteProps, 'component'> = {
    redirectPath: '/',
    requiresLoggedIn: false,
    requiresHouseJoined: false
  };
  
  return (
    <>
    <Routes>
      <Route path='/' element={<ProtectedRoute {...authRequiredJoinedHouseProps} component={<HomePage />} />} />
      <Route path="/account" element={<ProtectedRoute {...authRequiredNoHouseProps} component={<AccountPage />} />} />

      <Route path="/register" element={<ProtectedRoute {...notAuthRequiredProps} component={<RegisterPage />} />} />
      <Route path="/login" element={<ProtectedRoute {...notAuthRequiredProps} component={<LoginPage />} />} />
      <Route path="/resetpassword" element={<ProtectedRoute {...notAuthRequiredProps} component={<ResetPassword />} />} />

      <Route path='/no_house' element={<ProtectedRoute {...authRequiredNoHouseProps} component={<NoHouse />} />} />
    </Routes>
    </>
  )
}

export default App
