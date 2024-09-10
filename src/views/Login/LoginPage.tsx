import style from './LoginPage.module.scss'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners';
import { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import mapErrorMessages from '../../mapErrorMessages';
import Logo from '../../assets/logo.svg';


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
      setError(mapErrorMessages(error.code))
    })
    setLoading(false)
  }

  return (
    <>
      <div className='wrapper center'>
        <div className='box'>
          <img className='logo' src={Logo} alt="logo" />
          <form onSubmit={onSubmit}>
            <input className="input-field" type="text" placeholder='Email' name='email'/>
            <input className="input-field" type="password" placeholder='Password' name='password'/>
            <div className={style['actions-container']}>
              <div className={style['checkbox-container']}>
                <input type="checkbox" id="checkbox-remember" className={style.checkbox} name='checkboxRemember'/>
                <label htmlFor="checkbox-remember">Remember me</label>
              </div>
              <button type='button' className='text-button' onClick={() => {navigate("/resetpassword")}}>Reset password </button>
            </div>
            {loading ? <div className='spinner-container'><ClipLoader color="var(--secondary)" size="50px" /> </div>: <button type="submit" value="Login" className='button-primary'>Login</button>}
          </form>
          <div className='error-text'>{error}</div>
          <button type='button' id={style['register-button']} className='text-button' onClick={() => {navigate("/register")}}>You don't have an account? <span>Click here!</span></button>
        </div>
      </div>
    </>   
  )
}

export default LoginPage