import React from 'react'
import style from './LoginPage.module.css'
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom'
import { BeatLoader } from 'react-spinners';
import { useState } from 'react';
import mapFirebaseErrorMessages from '../../mapFirebaseErrorMessages';


interface LoginFormState {
  email: string,
  password: string,
  [key: string]: string;
}

function LoginPage() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [registerForm, setRegisterForm] = useState<LoginFormState>({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    for(const key in registerForm) {
      if(registerForm[key] === "") {
        setError("Please fill out all the fields.")
        return
      }
    }
    login()
  }

  const login = () => {
    setLoading(true)
    signInWithEmailAndPassword(auth, registerForm.email, registerForm.password)
      .then(() => {
        setLoading(false)
        navigate("/")
      })
      .catch((error) => {
        setLoading(false)
        setError(mapFirebaseErrorMessages(error.code))
      })
  }

  return (
    <>
    <div className='center-wrapper'>
      <div className='box-container'>
        <div className='large-title-form'>Create Account</div>
        <form onSubmit={event => onSubmit(event)}>
          <input type="text" placeholder='Email' value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})}/>
          <input type="password" placeholder='Password'value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})}/>
          {loading ? <div className='spinner-button'><BeatLoader color="rgb(155, 167, 177)" size="30px" /> </div>: <input type="submit" value="Login" className='full-button' />}
        </form>
        <div className='error-text'>{error}</div>
      </div>
    </div>
    </>   
  )
}

export default LoginPage