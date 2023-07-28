import React from 'react'
import style from './ModalConfirm.module.css'
import { useState } from 'react'
import { ClipLoader } from 'react-spinners'

type ModalProps =  {
  title: string,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  updateFunction: () => Promise<any> 
}

function ModalConfirm({title, setShowModal, updateFunction}: ModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleButtonClickConfirm = () => {
      setLoading(true)
      updateFunction().then(() => {
        setShowModal(false)
        setLoading(false)
      }).catch((error) => {
        setError((error))
        setLoading(false)
      })


  }

  const handleButtonClickClose = () => {
    setShowModal(false)
  }

  return (
    <div className={style.wrapper}>
      <div className='center-wrapper'>
        <div className={style['box-container-modal']}>
          <div className={style['large-title-modal']}>{title}</div>
            <div className='error-text'>{error}</div>
            <div className={style.buttonsContainer}>
              {loading ? <div className='spinner-button'><ClipLoader color="var(--orange)" size="50px" /> </div>: 
              <div><button className='full-button' style={{flex:"1"}} onClick={handleButtonClickConfirm}>Confirm</button>
              <button className='empty-button' style={{flex:"1"}} onClick={handleButtonClickClose}>Cancel</button></div>
              }
            </div>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirm