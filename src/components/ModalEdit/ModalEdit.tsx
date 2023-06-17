import React from 'react'
import style from './ModalEdit.module.css'
import { useRef, useState } from 'react'

type ModalProps =  {
  fieldTitle: string,
  fieldHint: string,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  updateFunction: (value: string) => Promise<any>
}

function ModalEdit({fieldTitle, fieldHint, setShowModal, updateFunction}: ModalProps) {

  const inputElement = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null)

  const handleButtonClick = () => {
    if(inputElement.current?.value) {
      updateFunction(inputElement.current?.value)
      setShowModal(false)
    }
    else {
      setError("The field cannot  be empty!")
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
          <div className={style['large-title-modal']}>{fieldTitle}</div>
          <input defaultValue={fieldHint} ref={inputElement}/>
          <div className='error-text'>{error}</div>
          <div className={style.buttonsContainer}>
            <button className='full-button' style={{flex:"1"}} onClick={handleButtonClick}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalEdit