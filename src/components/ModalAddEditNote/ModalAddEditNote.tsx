import { useEffect, useRef, useState } from 'react'
import style from './ModalAddEditNote.module.css'
import mapErrorMessages from '../../mapErrorMessages'
import { useNotesContext } from '../../context/NotesContext'
import { ClipLoader } from 'react-spinners'


type ModalProps =  {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  id?: string,
  title?: string,
  content?: string,
  pinned?: boolean
}

function ModalAddEditNote({setShowModal, id, title, content, pinned}: ModalProps){
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const notesContext = useNotesContext()
  

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const pinnedNote = formData.get("checkboxPinned") === "on";

    if(!title|| !content) {
      setError("Please fill out all the fields.")
      return
    }
    setLoading(true)
    await notesContext.addNote(Date.now(), pinnedNote, title, content, id).catch((error) => {
      setLoading(false)
      setError(mapErrorMessages(error.code))
    })
    setLoading(false)
    setShowModal(false)
  }

  const handleClose = () => {
    setShowModal(false)
    document.body.style.overflow = 'scroll';
  }

  useEffect(() => {
    const close = (e: any) => {
      if(e.key === 'Escape'){
        setShowModal(false)
        document.body.style.overflow = 'scroll';
      }
    }
    window.addEventListener('keydown', close)
  return () => window.removeEventListener('keydown', close)
},[])

  return (
    <>
      <div className={style.wrapper}>
        <div className='center-wrapper'>
          <div className={style['box-container-modal']}>
            <button className={style.closeButton} onClick={handleClose}>X</button>
            <form onSubmit={onSubmit} style={{width:'100%'}}>
              <input type="text" placeholder='Title' name='title' defaultValue={title} maxLength={50} style={{fontWeight:'700'}}/>
              <textarea name="content" placeholder='Content' defaultValue={content} className={style.contentTextarea}></textarea>
              <div className={style['checkbox-container']}>
                <input type="checkbox" id="checkbox-pinned" defaultChecked={pinned} className={style.checkbox} name='checkboxPinned'/>
                <label htmlFor="checkbox-pinned">Pinned Note</label>
              </div>
              <div className={style.buttonsContainer}>
                {loading ? <div className='spinner-button'><ClipLoader color="var(--secondary)" size="50px" /> </div>: <button className='full-button' style={{flex:"1"}} type='submit'>Save</button>}
                <div className='error-text'>{error}</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalAddEditNote