import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import RegisterPage from './views/Register/RegisterPage.tsx'
import LoginPage from './views/Login/LoginPage.tsx'
import HomePage from './views/Home/HomePage.tsx'
import firebaseConfig from './firebaseConfig.tsx'
import { initializeApp } from "firebase/app";


function App() {
  
  initializeApp(firebaseConfig);

  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
    </Routes>
      {/* <RegisterPage></RegisterPage> */}
    </>
  )
}

export default App
