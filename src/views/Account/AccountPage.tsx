import Navbar from '../../components/Navbar/Navbar'
import { useAuthContext } from '../../context/AuthContext';
import style from "./AccountPage.module.css"
import Modal from '../../components/ModalEdit/ModalEdit';
import { useState, useRef } from 'react';
import { Edit } from '@mui/icons-material';
import { ClipLoader } from 'react-spinners';
import mapFirebaseErrorMessages from '../../mapFirebaseErrorMessages';

function AccountPage() {
  const context = useAuthContext();
  
  const { currentUserDataDb } = context;
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const modal = useRef<JSX.Element | null>(null)

  const onEdit = (editType: string) => {
    setShowModal(true)
    switch(editType) {
      case 'name': {
        modal.current = <Modal fieldTitle={'New name'} fieldHint={currentUserDataDb?.name} setShowModal={setShowModal} reAuth={context.reauthenticateUser} repeatPasswordField = {false} updateFunction={context.updateName}></Modal>
        break
      }
      case 'email': {
        modal.current = <Modal fieldTitle={'Email'} fieldHint={currentUserDataDb?.email} setShowModal={setShowModal} reAuth={context.reauthenticateUser} repeatPasswordField = {false} updateFunction={context.updateEmailUser}></Modal>
        break
      }
      case 'password': {
        modal.current = <Modal fieldTitle={'New password'} fieldHint={undefined} setShowModal={setShowModal} reAuth={context.reauthenticateUser} repeatPasswordField = {true} updateFunction={context.updatePasswordUser}></Modal>
        break
      }
    }
  }

  const onLogoutButton = async () => {
    setLoading(true)
    await context.logout().catch((error) => {
      mapFirebaseErrorMessages(error.code)
    })
    setLoading(false)
  }

  return (
    <>
      <Navbar showAllOptions/>

      <div className='top-wrapper'>
      <div className='box-container'>
        <div className='large-title-form'>Account info</div>

        <div className='edit-label-container'>
          <div className='edit-label-icon-subcontainer'>
              <div className='label'>Name</div>
              <Edit onClick={() => {onEdit("name")}}/>
          </div>
            <p>{currentUserDataDb?.name}</p>
        </div>  

        <div className='edit-label-container'>
          <div className='edit-label-icon-subcontainer'>
              <div className={style.label}>Email</div>
              <Edit onClick={() => {onEdit("email")}}/>
          </div>
            <p>{currentUserDataDb?.email}</p>
        </div>  

        <div className='edit-label-container'>
          <div className='edit-label-icon-subcontainer'>
              <div className='label'>Password</div>
              <Edit onClick={() => {onEdit("password")}}/>
          </div>
            <p>********</p>
        </div> 
        {loading ? <div className='spinner-button'><ClipLoader color="var(--orange)" size="50px" /> </div>:<button className='full-button' style={{width: "50%"}} onClick={onLogoutButton}>Logout</button>}
        <div className='error-text'>{error}</div>
      </div>
      {showModal && modal.current}
    </div>
    </>
  )
}

export default AccountPage