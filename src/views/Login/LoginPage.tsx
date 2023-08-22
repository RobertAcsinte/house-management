import style from './LoginPage.module.css'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners';
import { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import mapFirebaseErrorMessages from '../../mapFirebaseErrorMessages';
import Logo from '../../assets/logo.png';


 function LoginPage() {
  const context = useAuthContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const rememberCheck = formData.get("checkboxRemember") === "on";

    if(!email|| !password) {
      setError("Please fill out all the fields.")
      return
    }
    setLoading(true)
    await context?.login(email, password, rememberCheck).catch((error) => {
      setLoading(false)
      setError(mapFirebaseErrorMessages(error.code))
    })
    setLoading(false)
  }

  return (
    <>
    <div className='center-wrapper-nonav'>
      <div className='box-container'>
        <img className='logo-form' src={Logo} alt="logo" />
        <form onSubmit={onSubmit}>
          <input type="text" placeholder='Email' name='email'/>
          <input type="password" placeholder='Password' name='password'/>
          <div className={style['login-extra-container']}>
            <div className={style['checkbox-container']}>
              <input type="checkbox" id="checkbox-remember" className={style.checkbox} name='checkboxRemember'/>
              <label htmlFor="checkbox-remember">Remember me</label>
            </div>
            <button type='button' className={style['button-forgot-password']} onClick={() => {navigate("/resetpassword")}}>Forgot your password?</button>
          </div>
          {loading ? <div className='spinner-button'><ClipLoader color="var(--orange)" size="50px" /> </div>: <div style={{textAlign: "center", width: "100%"}}><button type="submit" value="Login" className='full-button' >Login</button></div>}
        </form>
        <div className='error-text'>{error}</div>
        <button type='button' className={style['button-create-account']} onClick={() => navigate("/register")}>You don't have an account? <span style={{textDecoration: 'underline'}}>Click here!</span></button>
      </div>
    </div>
    </>   
  )
}

export default LoginPage