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
        <div className='large-title-form'>Login</div>
        <form onSubmit={event => onSubmit(event)}>
          <input type="text" placeholder='Email' value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})}/>
          <input type="password" placeholder='Password'value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})}/>
          <div className={style['login-extra-container']}>
            <div className={style['checkbox-container']}>
              <input type="checkbox" id="checkbox-remember"className={style.checkbox}/>
              <label htmlFor="checkbox-remember">Remember me</label>
            </div>
            <button className={style['button-forgot-password']}>Forgot your password?</button>
          </div>
          {loading ? <div className='spinner-button'><BeatLoader color="rgb(155, 167, 177)" size="30px" /> </div>: <input type="submit" value="Login" className='full-button' />}
        </form>
        <div className='error-text'>{error}</div>
        <button className={style['button-create-account']} onClick={() => navigate("/register")}>You don't have an account? <span style={{textDecoration: 'underline'}}>Click here!</span></button>
      </div>
    </div>
    </>   
  )
}

export default LoginPage