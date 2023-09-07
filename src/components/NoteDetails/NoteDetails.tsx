import React, { useEffect, useRef } from 'react'
import style from './NoteDetails.module.css'
import { useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { NoteDataDb, useNotesContext } from '../../context/NotesContext'
import Avatar from '../../assets/avatar.jpeg';
import ModalConfirm from '../ModalConfirm/ModalConfirm'
import ModalAddNote from '../ModalAddEditNote/ModalAddEditNote'
import { useAuthContext } from '../../context/AuthContext'

type NoteDetailsProps =  {
  note: NoteDataDb,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  onNoteUpdateFunction: (note: NoteDataDb) => void
}

function NoteDetails({note, setShowModal, onNoteUpdateFunction}: NoteDetailsProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [showModalEdit, setShowModalEdit] = useState<boolean>(false)
  const [imgLoading, setImgLoading] = useState(true)
  const [photoURL, setPhotoURL] = useState<string>()
  const modal = useRef<JSX.Element | null>(null)
  const notesContext = useNotesContext()
  const context = useAuthContext()

  var minutes: string | number = new Date(note.date).getMinutes() 
  var hours: string | number = new Date(note.date).getHours() 

  if(minutes < 10) {
    minutes = "0" + minutes
  }

  if(hours < 10) {
    hours = "0" + hours
  }

  const onNoteDelete = () => {
    setShowModalEdit(true)
    modal.current =
      <ModalConfirm 
        title="Are you sure you want to delete?" 
        setShowModal={setShowModalEdit} 
        updateFunction={() => notesContext.deleteNote(note.id)}
        setFirstShowModal={setShowModal}
      />
  }

  const onNoteUpdate = () => {
    onNoteUpdateFunction(note)
  }


  const handleButtonClickClose = () => {
    setShowModal(false)
    document.body.style.overflow = 'scroll';
  }

  function handleLoad () {
    setImgLoading(false)
  }

  useEffect(() => {
    const getPhoto = async () => {
      const defaultPhoto = await context.getAvatarURL(note.userId)
      if(defaultPhoto) {
        setPhotoURL(defaultPhoto)
      }
    }
    getPhoto().catch(() => {
      setPhotoURL("../../../public/default.png")
    })
  }, [])

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
    <div className={style.wrapper}>
      <div className='center-wrapper'>
        <div className={style['box-container-modal']}>
          <div className={style.closeButton} onClick={handleButtonClickClose}>X</div>
          <div className={style['large-title-modal']}>{note.title}</div>

          <div className={style.noteDetails}>
          <div className={style.spinner} style={{ display: imgLoading ? "flex" : "none" }}>
            <div className={style.spinnerButton}>
              <ClipLoader color="var(--background)" size="65px" />
            </div>
          </div>
          <div className={style.imgContainer}>
            <img className={style.avatar} src= {photoURL} onLoad={handleLoad} style={{display: imgLoading ? "none" : "block"}} alt="avatar" />
          </div>
            <div className={style.noteDetailsText}>
            <p><b>{note.userName}</b></p>
            <p>{new Date(note.date).toLocaleDateString("nl-NL")} {hours}:{minutes}</p>
            </div>
          </div>
          
          <div className={style['content']}>{note.content}</div>
            <div className='error-text'>{error}</div>
            <div className={style.buttonsContainer}>
              {loading ? <div className='spinner-button'><ClipLoader color="var(--secondary)" size="50px" /> </div>: 
              <div className=''><button className='full-button' style={{flex:"1"}} onClick={onNoteUpdate}>Edit</button>
              <button className='empty-button' style={{flex:"1"}} onClick={onNoteDelete}>Delete</button></div>
              }
            </div>
        </div>
      </div>
      {showModalEdit && modal.current}
    </div>
  )
}

export default NoteDetails