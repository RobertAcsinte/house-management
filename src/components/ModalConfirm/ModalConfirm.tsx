import React from 'react'
import style from './ModalConfirm.module.css'
import { useNavigate } from 'react-router-dom'

type ModalProps =  {
  title: string,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  navigateRoute: string
}

function ModalConfirm({title, setShowModal, navigateRoute}: ModalProps) {
  const navigate = useNavigate()

  const handleButtonClick = () => {
    setShowModal(false)
    navigate(navigateRoute)
  }

  return (
    <div className={style.wrapper}>
      <div className='center-wrapper'>
        <div className={style['box-container-modal']}>
          <div className={style['large-title-modal']}>{title}</div>
            <button className='full-button' onClick={handleButtonClick}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirm