import { useNavigate } from 'react-router-dom'
import { BeatLoader } from 'react-spinners';
import { useState } from 'react';
import { useAuthContext } from '../../context/authContext';
import mapFirebaseErrorMessages from '../../mapFirebaseErrorMessages';

function ResetPassword() {
  const context = useAuthContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const email = formData.get("email") as string

    if(email === "") {
      setError("Please fill out the email field.")
      return
    }

    setLoading(true)
    context.resetPassword(email)
    .then(() => {
      navigate("/")
    })
    .catch((forgotPasswordError) => {
      setLoading(false)
      setError(mapFirebaseErrorMessages(forgotPasswordError.code))
    })

  }

  return (
    <>
    <div className='center-wrapper'>
      <div className='box-container'>
        <div className='large-title-form'>Reset Password</div>
        <form onSubmit={event => onSubmit(event)}>
          <input type="text" placeholder='Email' name='email'/>
          {loading ? <div className='spinner-button'><BeatLoader color="rgb(155, 167, 177)" size="30px" /> </div>: <input type="submit" value="Send" className='full-button' />}
        </form>
        <div className='error-text'>{error}</div>
      </div>
    </div>
    </>   
  )
}

export default ResetPassword