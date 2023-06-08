import style from './LoginPage.module.css'
import { useNavigate } from 'react-router-dom'
import { BeatLoader } from 'react-spinners';
import { useState } from 'react';
import { useAuthContext } from '../../context/authContext';
import mapFirebaseErrorMessages from '../../mapFirebaseErrorMessages';


function LoginPage() {
  const context = useAuthContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if(email === "" || password === "") {
      setError("Please fill out all the fields.")
      return
    }

    setLoading(true)
    context?.login(email, password).then(() => {
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
          <input type="text" placeholder='Email' name='email'/>
          <input type="password" placeholder='Password' name='password'/>
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