import Navbar from '../../components/Navbar/Navbar'
import { useAuthContext } from '../../context/AuthContext';
import style from "./AccountPage.module.css"
import Modal from '../../components/ModalEdit/ModalEdit';
import { useState, useRef } from 'react';
import { Edit } from '@mui/icons-material';
import ModalConfirm from '../../components/ModalConfirm/ModalConfirm';

function AccountPage() {
  const context = useAuthContext();
  
  const { currentUserDataDb } = context;
  const [showModal, setShowModal] = useState(false)

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
    setShowModal(true)
    modal.current = <ModalConfirm title='Are you sure you want to logout?' setShowModal={setShowModal} updateFunction={context.logout}></ModalConfirm>
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
        <button className='full-button' style={{width: "50%"}} onClick={onLogoutButton}>Logout</button>
      </div>
      {showModal && modal.current}
    </div>
    </>
  )
}

export default AccountPage