import style from './LoginPage.module.scss'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners';
import { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import mapErrorMessages from '../../mapErrorMessages';
import Logo from '../../assets/logo.svg';
import Input from '../../components/Input/Input';
import { FormProvider, useForm } from 'react-hook-form';
import { email_validation, password_validation } from '../../utils/validations';

type Inputs = {
  email: string,
  password:string,
  checkboxRemember: boolean
}

 function LoginPage() {
  const context = useAuthContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const methods = useForm<Inputs>()

  const onSubmitHook = methods.handleSubmit(async (data: Inputs) => {
    setLoading(true)
    await context?.login(data.email, data.password, data.checkboxRemember).catch((error) => {
      setLoading(false)
      setError(mapErrorMessages(error.code))
    })
    setLoading(false)
  })

  return (
    <>
      <div className='wrapper center'>
        <div className='box'>
          <img className='logo' src={Logo} alt="logo" />
          <FormProvider {...methods}>
            <form
              onSubmit={e => e.preventDefault()}
              noValidate
              className="container"
            >
              <Input {...email_validation} />
              <Input {...password_validation} />
              <div className={style['actions-container']}>
                <Input type='checkbox' id='checkbox-remember' name='checkboxRemember' label='Remember me'/>
                <button type='button' className='text-button' onClick={() => {navigate("/resetpassword")}}>Reset password </button>
              </div>
              {loading ? <div className='spinner-container'><ClipLoader color="var(--secondary)" size="50px" /> </div>: <button type="submit" value="Login" className='button-primary' onClick={onSubmitHook}>Login</button>}
            </form>
          </FormProvider>
          <div className='error-text'>{error}</div>
          <button type='button' id={style['register-button']} className='text-button' onClick={() => {navigate("/register")}}>You don't have an account? <span>Click here!</span></button>
        </div>
      </div>
    </>   
  )
}

export default LoginPage