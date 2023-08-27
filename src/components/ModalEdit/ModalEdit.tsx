import React from 'react'
import style from './ModalEdit.module.css'
import { useRef, useState } from 'react'
import { UserCredential } from 'firebase/auth'
import mapErrorMessages from '../../mapErrorMessages';
import { ClipLoader } from 'react-spinners';

type ModalProps =  {
  fieldTitle: string,
  fieldHint: string | undefined,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  reAuth: ((password: string) => Promise<UserCredential>) | null,
  repeatPasswordField: boolean,
  updateFunction: (value: string) => Promise<any>
}

function ModalEdit({fieldTitle, fieldHint, setShowModal, reAuth, repeatPasswordField, updateFunction}: ModalProps) {

  const inputElementEdit = useRef<HTMLInputElement>(null)
  const inputElementPassword = useRef<HTMLInputElement>(null)
  const inputElementRepeatPassword = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)


  const newValueFieldStyle = repeatPasswordField ? "password" : "text"

  const handleButtonClick = async () => {
    if(inputElementEdit.current?.value) {
      if(reAuth) {
        if(repeatPasswordField) {
          if(inputElementEdit.current?.value !== inputElementRepeatPassword.current?.value) {
            setError("Password don't match.")
            return
          }
        }

        if(inputElementPassword.current?.value) {
          setLoading(true)
          const successLogin = await reAuth(inputElementPassword.current.value).catch((error) => {
            setError(mapErrorMessages(error.code))
          })
          if(successLogin) {
            updateFunction(inputElementEdit.current.value).then(() => {
              setShowModal(false)
              setLoading(false)
            }).catch((error) => {
              repeatPasswordField ? setError(mapErrorMessages(error.code)) : setError(mapErrorMessages(error))
              setLoading(false)
            })
          } else {
            setLoading(false)
            return
          }
        } else {
          setError("Current password field cannot be empty!")
          return
        }
      } else {
        setLoading(true)
        updateFunction(inputElementEdit.current.value).then(() => {
          setShowModal(false)
          setLoading(false)
        }).catch((error) => {
          setError(mapErrorMessages(error))
          setLoading(false)
        })
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
      <div className='center-wrapper' style={{height:"100%"}}>
        <div className={style['box-container-modal']}>
          <button className={style.closeButton} onClick={handleClose}>X</button>
          <div className={style['large-title-modal']}>{fieldTitle}</div>
          <input defaultValue={fieldHint} ref={inputElementEdit} placeholder={fieldTitle} type={newValueFieldStyle}/>
          {repeatPasswordField && <input type="password" placeholder='Repeat password' ref={inputElementRepeatPassword}/> }
          {reAuth && <input type="password" placeholder='Current password' ref={inputElementPassword}/> }
          <div className='error-text'>{error}</div>
          <div className={style.buttonsContainer}>
          {loading ? <div className='spinner-button'><ClipLoader color="var(--secondary)" size="50px" /> </div>: <button className='full-button' style={{flex:"1"}} onClick={handleButtonClick}>Save</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalEdit