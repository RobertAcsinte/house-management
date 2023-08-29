import Navbar from '../../components/Navbar/Navbar'
import { useAuthContext } from '../../context/AuthContext';
import style from "./AccountPage.module.css"
import Modal from '../../components/ModalEdit/ModalEdit';
import { useState, useRef, useEffect } from 'react';
import { Edit } from '@mui/icons-material';
import ModalConfirm from '../../components/ModalConfirm/ModalConfirm';
import { updateProfile } from 'firebase/auth';
import { ClipLoader } from 'react-spinners';
import ModalChangePhoto from '../../components/ModalChangePhoto/ModalChangePhoto';

function AccountPage() {
  const context = useAuthContext();
  
  const { currentUserDataDb } = context;
  const [showModal, setShowModal] = useState(false)
  const [imgLoading, setImgLoading] = useState(true)

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

  const onChangePhoto = () => {
    setShowModal(true)
    modal.current = 
    <ModalChangePhoto 
      setShowModal={setShowModal} 
      uploadFile={context.uploadFile}
    />
  }

  const onLogoutButton = async () => {
    setShowModal(true)
    modal.current = <ModalConfirm title='Are you sure you want to logout?' setShowModal={setShowModal} updateFunction={context.logout}></ModalConfirm>
  }

  var photoURL: string = context.currentUser!.photoURL ? context.currentUser!.photoURL : "default.png"

  function handleLoad () {
    setImgLoading(false)
  }
  
  return (
    <>
      <Navbar showAllOptions/>

      <div className='top-wrapper'>
      <div className='box-container'>
        <div className='large-title-form' style={{marginBottom:'10px'}}>Account info</div>
        <div style={{display: imgLoading ? "block" : "none"}}>
          <div className='spinner-button'>
            <ClipLoader color="var(--secondary)" size="50px" />
          </div>
        </div>
        <img className={style.avatar} src= {photoURL} onLoad={handleLoad} style={{display: imgLoading ? "none" : "block"}}/>
        <button className='full-button-small' onClick={onChangePhoto}>Change</button>
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