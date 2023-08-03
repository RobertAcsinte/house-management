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
import KitchenPage from './views/Kitchen/KitchenPage.tsx'


function App() {

  const authRequiredNoHouseProps: Omit<ProtectedRouteProps, 'component'> = {
    redirectPathAuthCondition: '/login',
    redirectPathHouseCondition: '/',
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
    redirectPathAuthCondition: '/',
    redirectPathHouseCondition: '/',
    requiresLoggedIn: false,
    requiresHouseJoined: false,
    isAccount: false
  };

  const authRequiredIsAccountProps: Omit<ProtectedRouteProps, 'component'> = {
    redirectPathAuthCondition: '/login',
    redirectPathHouseCondition: '/',
    requiresLoggedIn: true,
    requiresHouseJoined: false,
    isAccount: true
  };
  
  return (
    <>
    <Routes>
      <Route path='/' element={<ProtectedRoute {...authRequiredJoinedHouseProps} component={<HomePage />} />} />
      <Route path='/myhouse' element={<ProtectedRoute {...authRequiredJoinedHouseProps} component={<MyHouse />} />} />
      <Route path='/kitchen' element={<ProtectedRoute {...authRequiredJoinedHouseProps} component={<KitchenPage />} />} />

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
