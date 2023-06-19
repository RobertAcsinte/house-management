import React from 'react'
import style from './ModalSingleField.module.css'
import { useRef, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import mapFirebaseErrorMessages from '../../mapFirebaseErrorMessages'

type ModalProps =  {
  modalTitle: string,
  fieldHint: string | undefined,
  buttonText: string,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  updateFunction: (value: string) => Promise<any>
}

function ModalSingleField({modalTitle, fieldHint, buttonText, setShowModal, updateFunction}: ModalProps) {
  const inputElement = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleButtonClick = () => {
    if(inputElement.current?.value) {
      setLoading(true)
      updateFunction(inputElement.current.value).then(() => {
        
        setShowModal(false)
        setLoading(false)
      }).catch((error) => {
        setError((error))
        setLoading(false)
      })
    }
    else {
      setError("The field cannot be empty!")
    }
  }

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <div className={style.wrapper}>
      <div className='center-wrapper'>
        <div className={style['box-container-modal']}>
          <button className={style.closeButton} onClick={handleClose}>X</button>
          <div className={style['large-title-modal']}>{modalTitle}</div>
          <input ref={inputElement} placeholder={fieldHint}/>
          <div className='error-text'>{error}</div>
          <div className={style.buttonsContainer}>
          {loading ? <div className='spinner-button'><ClipLoader color="var(--orange)" size="50px" /> </div>: <button className='full-button' style={{flex:"1"}} onClick={handleButtonClick}>{buttonText}</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalSingleField