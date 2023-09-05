import React, { useEffect } from 'react'
import style from './ModalInfo.module.css'
import { useNavigate } from 'react-router-dom'

type ModalProps =  {
  title: string,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  navigateRoute: string
}

function ModalInfo({title, setShowModal, navigateRoute}: ModalProps) {
  const navigate = useNavigate()

  const handleButtonClick = () => {
    setShowModal(false)
    navigate(navigateRoute)
  }

  useEffect(() => {
    const close = (e: any) => {
      if(e.key === 'Escape'){
        setShowModal(false)
      }
    }
    window.addEventListener('keydown', close)
  return () => window.removeEventListener('keydown', close)
  },[])

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

export default ModalInfo