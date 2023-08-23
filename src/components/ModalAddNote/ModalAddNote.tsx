import { useRef } from 'react'
import style from './ModalAddNote.module.css'


type ModalProps =  {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
}

function ModalAddNote({setShowModal}: ModalProps){

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const rememberCheck = formData.get("checkboxRemember") === "on";
  }

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <>
      <div className={style.wrapper}>
        <div className='center-wrapper' style={{height:"100%"}}>
          <div className={style['box-container-modal']}>
            <button className={style.closeButton} onClick={handleClose}>X</button>
            <form onSubmit={onSubmit}>
              <input type="text" placeholder='Title' name='title'/>
              <textarea name="content" placeholder='Content' className={style.contentTextarea}></textarea>
              <div className={style['checkbox-container']}>
                <input type="checkbox" id="checkbox-pinned" className={style.checkbox} name='checkboxPinned'/>
                <label htmlFor="checkbox-pinned">Pinned Note</label>
              </div>
              <div className={style.buttonWrapper}>
                <button className="full-button-small" type='submit'>Create Note</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalAddNote