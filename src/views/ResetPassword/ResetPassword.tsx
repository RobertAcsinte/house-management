import { ClipLoader } from 'react-spinners';
import { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import mapFirebaseErrorMessages from '../../mapFirebaseErrorMessages';
import Modal from '../../components/ModalConfirm/ModalConfirm';
import Logo from '../../assets/logo.png';

function ResetPassword() {
  const context = useAuthContext()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    if(!email) {
      setError("Please fill out the email field.")
      return
    }

    setLoading(true)
    context.resetPassword(email)
    .then(() =>  
      {
        setLoading(false)
        void setShowModal(true)
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
      <img className='logo-form' src={Logo} alt="logo" />
        <form onSubmit={event => onSubmit(event)}>
          <input type="text" placeholder='Email' name='email'/>
          {loading ? <div className='spinner-button' style={{marginTop:"65px"}}><ClipLoader color="var(--orange)" size="50px" /> </div>: <button type="submit" className='full-button'>Send reset link</button>} 
        </form>
        <div className='error-text'>{error}</div>
      </div>
    </div>
    {showModal && <Modal navigateRoute={'/'} title={'Confirmation sent, please check your email.'} setShowModal={setShowModal}></Modal>}
    </>   
  )
}

export default ResetPassword