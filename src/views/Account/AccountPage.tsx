import Navbar from '../../components/Navbar/Navbar'
import { useAuthContext } from '../../context/AuthContext';
import style from "./AccountPage.module.css"
import Modal from '../../components/ModalEdit/ModalEdit';
import { useState, useRef } from 'react';
import { Edit } from '@mui/icons-material';

function AccountPage() {
  const context = useAuthContext();
  
  const { currentUserDataDb } = context;
  const [showModal, setShowModal] = useState(false)

  const modal = useRef<JSX.Element | null>(null)

  const onEdit = (editType: string) => {
    setShowModal(true)
    switch(editType) {
      case 'name': {
        modal.current = <Modal fieldTitle={'Name'} fieldHint={currentUserDataDb.name} setShowModal={setShowModal} updateFunction={context.updateName}></Modal>
        break
      }
      case 'email': {
        modal.current = <Modal fieldTitle={'Email'} fieldHint={currentUserDataDb.email} setShowModal={setShowModal} updateFunction={context.updateName}></Modal>
        break
      }
      case 'password': {
        modal.current = <Modal fieldTitle={'Password'} fieldHint={currentUserDataDb.name} setShowModal={setShowModal} updateFunction={context.updateName}></Modal>
        break
      }
    }
  }

  return (
    <>
      <Navbar userName={currentUserDataDb?.name}/>

      <div className={style.wrapper}>
      <div className='box-container'>
        <div className='large-title-form'>Account info</div>

        <div className={style.container}>
          <div className={style.editContainer}>
              <div className={style.label}>Name</div>
              <Edit onClick={() => {onEdit("name")}}/>
          </div>
            <p>{currentUserDataDb.name}</p>
        </div>  

        <div className={style.container}>
          <div className={style.editContainer}>
              <div className={style.label}>Email</div>
              <Edit onClick={() => {onEdit("email")}}/>
          </div>
            <p>{currentUserDataDb.email}</p>
        </div>  

        <div className={style.container}>
          <div className={style.editContainer}>
              <div className={style.label}>Password</div>
              <Edit onClick={() => {onEdit("password")}}/>
          </div>
            <p>********</p>
        </div> 

      </div>
      {showModal && modal.current}
    </div>
    </>
  )
}

export default AccountPage