import { useRef, useState } from 'react'
import style from './ModalAddNote.module.css'
import mapFirebaseErrorMessages from '../../mapFirebaseErrorMessages'
import { useNotesContext } from '../../context/NotesContext'
import { ClipLoader } from 'react-spinners'


type ModalProps =  {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
}

function ModalAddNote({setShowModal}: ModalProps){
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
    await notesContext.addNote(Date.now(), pinnedNote, title, content).catch((error) => {
      setLoading(false)
      setError(mapFirebaseErrorMessages(error.code))
    })
    setLoading(false)
    setShowModal(false)
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
              <div className={style.buttonsContainer}>
                {loading ? <div className='spinner-button'><ClipLoader color="var(--orange)" size="50px" /> </div>: <button className='full-button' style={{flex:"1"}} type='submit'>Save</button>}
                <div className='error-text'>{error}</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalAddNote