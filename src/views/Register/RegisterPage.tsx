import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { BeatLoader } from 'react-spinners';
import mapFirebaseErrorMessages from '../../mapFirebaseErrorMessages';
import { useAuthContext } from '../../context/authContext';


function RegisterPage() {
  // const auth = getAuth();
  // const database = getDatabase();

  const context = useAuthContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const password = formData.get("password") as string
    const repeatPassword = formData.get("repeatPassword") as string

    if(email === "" || name === "" || password === "" || repeatPassword === "") {
      setError("Please fill out all the fields.")
      return
    }
    if(repeatPassword !== password) {
      setError("Passwords don't match.")
      return
    }

    setLoading(true)
    context.register(email, password)
      .then((userCredential) => {
        context.saveUserDb(userCredential.user.uid, email, name)
          .then(() => {
            //login automatically after register
            context.login(email, password)
              .then(() => {
                setLoading(false)
                navigate("/")
              })
              .catch((loginError) => {
                setLoading(false)
                setError(mapFirebaseErrorMessages(loginError.code))
              })
          })
          .catch((dbError) => {
            setLoading(false)
            setError(mapFirebaseErrorMessages(dbError.code))
          })
      })
      .catch((registerError) => {
        setLoading(false)
        setError(mapFirebaseErrorMessages(registerError.code))
      })
  }

  return (
      <>
      <div className='center-wrapper'>
        <div className='box-container'>
          <div className='large-title-form'>Create Account</div>
          <form onSubmit={event => onSubmit(event)}>
            <input type="text" placeholder='Email' name='email'/>
            <input type="text" placeholder='Name' name='name'/>
            <input type="password" placeholder='Password' name='password'/>
            <input type="password" placeholder='Repeat Password' name='repeatPassword'/>
            {loading ? <div className='spinner-button'><BeatLoader color="rgb(155, 167, 177)" size="30px" /> </div>: <input type="submit" value="Register" className='full-button' />}
          </form>
          <div className='error-text'>{error}</div>
        </div>
      </div>
      </>    
  )
}

export default RegisterPage;
