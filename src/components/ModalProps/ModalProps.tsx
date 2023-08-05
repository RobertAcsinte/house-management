import React, { ReactNode } from 'react'
import style from './ModalProps.module.css'
import { useRef, useState } from 'react'
import mapFirebaseErrorMessages from '../../mapFirebaseErrorMessages';
import { ClipLoader } from 'react-spinners';

type ModalPropsType =  {
  fieldTitle: string,

  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  // updateFunction: (value: string) => Promise<any>
  reactNodes: ReactNode[];
}

function ModalProps({fieldTitle, setShowModal, reactNodes}: ModalPropsType) {


  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)


  const handleButtonClick = async () => {

  }

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <div className={style.wrapper}>
      <div className='center-wrapper' style={{height:"100%"}}>
        <div className={style['box-container-modal']}>
          <button className={style.closeButton} onClick={handleClose}>X</button>
          <div className={style['large-title-modal']}>{fieldTitle}</div>
            {reactNodes}
          <div className='error-text'>{error}</div>
          <div className={style.buttonsContainer}>
          {loading ? <div className='spinner-button'><ClipLoader color="var(--orange)" size="50px" /> </div>: <button className='full-button' style={{flex:"1"}} onClick={handleButtonClick}>Save</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalProps