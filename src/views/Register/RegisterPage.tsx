import { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import mapFirebaseErrorMessages from '../../mapFirebaseErrorMessages';
import { useAuthContext } from '../../context/AuthContext';
import Logo from '../../assets/logo.png';


function RegisterPage() {

  const context = useAuthContext()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const password = formData.get("password") as string
    const repeatPassword = formData.get("repeatPassword") as string

    if (!email || !name || !password || !repeatPassword) {
      setError("Please fill out all the fields.")
      return
    }
    if (repeatPassword !== password) {
      setError("Passwords don't match.")
      return
    }

    setLoading(true)
    const userCredential = await context.register(email, password).catch((registerError) => {
      setLoading(false)
      setError(mapFirebaseErrorMessages(registerError.code))
    })

    if (userCredential) {
      context.saveUserDb(userCredential.user.uid, email, name).catch((registerError) => {
        setLoading(false)
        setError(mapFirebaseErrorMessages(registerError.code))
      })

      context.login(email, password, true).catch((loginError) => {
        setLoading(false)
        setError(mapFirebaseErrorMessages(loginError.code))
      })
    }
  }

  return (
    <>
      <div className='center-wrapper'>
        <div className='box-container'>
          <img className='logo-form' src={Logo} alt="logo" />
          <form onSubmit={event => onSubmit(event)}>
            <input type="text" placeholder='Email' name='email' />
            <input type="text" placeholder='Name' name='name' />
            <input type="password" placeholder='Password' name='password' />
            <input type="password" placeholder='Repeat Password' name='repeatPassword' />
            {loading ? <div className='spinner-button' style={{marginTop:"65px"}}><ClipLoader color="var(--orange)" size="50px" /> </div> : <button type="submit" className='full-button'>Register</button>}
          </form>
          <div className='error-text'>{error}</div>
        </div>
      </div>
    </>
  )
}

export default RegisterPage;
