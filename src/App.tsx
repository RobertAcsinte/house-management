import './App.css'
import { Route, Routes } from 'react-router-dom'
import RegisterPage from './views/Register/RegisterPage.tsx'
import LoginPage from './views/Login/LoginPage.tsx'
import HomePage from './views/Home/HomePage.tsx'
import ResetPassword from './views/ResetPassword/ResetPassword.tsx'


function App() {
  
  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/resetpassword" element={<ResetPassword/>}/>
    </Routes>
    </>
  )
}

export default App
