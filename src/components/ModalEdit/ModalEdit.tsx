import React from 'react'
import style from './ModalEdit.module.css'
import { useRef, useState } from 'react'
import { UserCredential } from 'firebase/auth'
import mapFirebaseErrorMessages from '../../mapFirebaseErrorMessages';

type ModalProps =  {
  fieldTitle: string,
  fieldHint: string,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  reAuth: ((password: string) => Promise<UserCredential>) | null,
  // repeatPasswordField: boolean,
  updateFunction: (value: string) => Promise<any>
}

function ModalEdit({fieldTitle, fieldHint, setShowModal, reAuth, updateFunction}: ModalProps) {

  const inputElementEdit = useRef<HTMLInputElement>(null);
  const inputElementPassword = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null)

  const handleButtonClick = async () => {
    if(inputElementEdit.current?.value) {
      if(reAuth) {
        if(inputElementPassword.current?.value) {
          const successLogin = await reAuth(inputElementPassword.current.value).catch((error) => {
            setError(mapFirebaseErrorMessages(error.code))
          })
          if(successLogin) {
            await updateFunction(inputElementEdit.current.value).catch((error) => {
              setError(mapFirebaseErrorMessages(error.code))
            })
            setShowModal(false)
          } else {
            return
          }
        } else {
          setError("Password field cannot be empty!")
          return
        }
      } else {
        const successFunction = await updateFunction(inputElementEdit.current.value).catch((error) => {
          setError(error.code)
        })
        if(successFunction) {
          setShowModal(false)
        }
      }
    }
    else {
      setError(`The ${fieldTitle.toLocaleLowerCase()} field cannot be empty!`)
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
          <input defaultValue={fieldHint} ref={inputElementEdit} placeholder={fieldTitle}/>
          {reAuth && <input type="password" placeholder='Current password' ref={inputElementPassword}/> }
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