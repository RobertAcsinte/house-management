import React, { useEffect } from 'react'
import style from './ModalInfo.module.scss'
import { useNavigate } from 'react-router-dom'

type ModalProps =  {
  text: string,
  navigateRoute: string
}

function ModalInfo({text, navigateRoute}: ModalProps) {
  const navigate = useNavigate()

  const handleButtonClick = () => {
    navigate(navigateRoute)
  }

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if(e.key === 'Escape'){
        navigate(navigateRoute)
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  },[navigate, navigateRoute])

  return (
      <main>
        <div className={style['wrapper-modal']}>
          <div className='wrapper center'>
            <div className={style['box-container-modal']}>
              <p className={style['text-modal']} role="alert">{text}</p>
              <button className='button-primary' onClick={handleButtonClick}>Close</button>
            </div>
          </div>
        </div>
      </main>
  )
}

export default ModalInfo