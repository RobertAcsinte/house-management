import React from 'react'
import style from './NoteDetails.module.css'
import { useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { NoteDataDb, useNotesContext } from '../../context/NotesContext'
import Avatar from '../../assets/avatar.jpeg';

type NoteDetailsProps =  {
  note: NoteDataDb,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
}

function NoteDetails({note, setShowModal}: NoteDetailsProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const notesContext = useNotesContext()

  var minutes: string | number = new Date(note.date).getMinutes() 
  var hours: string | number = new Date(note.date).getHours() 

  if(minutes < 10) {
    minutes = "0" + minutes
  }

  if(hours < 10) {
    hours = "0" + hours
  }

  const onNoteDelete = () => {
      setLoading(true)
      notesContext.deleteNote(note.id).then(() => {
        setShowModal(false)
        setLoading(false)
      }).catch((error) => {
        setError((error))
        setLoading(false)
      })
  }


  const handleButtonClickClose = () => {
    setShowModal(false)
    document.body.style.overflow = 'scroll';
  }

  return (
    <div className={style.wrapper}>
      <div className='center-wrapper'>
        <div className={style['box-container-modal']}>
          <div className={style.closeButton} onClick={handleButtonClickClose}>X</div>
          <div className={style['large-title-modal']}>{note.title}</div>
          <div className={style.noteDetails}>
            <img className={style.avatar} src={Avatar} alt="avatar" />
            <div className={style.noteDetailsText}>
            <p></p><b>{note.userName}</b>
            <p>{new Date(note.date).toLocaleDateString("nl-NL")} {hours}:{minutes}</p>
          </div>
          </div>
          <div className={style['content']}>{note.content}</div>
            <div className='error-text'>{error}</div>
            <div className={style.buttonsContainer}>
              {loading ? <div className='spinner-button'><ClipLoader color="var(--secondary)" size="50px" /> </div>: 
              <div className=''><button className='full-button' style={{flex:"1"}}>Edit</button>
              <button className='empty-button' style={{flex:"1"}} onClick={onNoteDelete}>Delete</button></div>
              }
            </div>
        </div>
      </div>
    </div>
  )
}

export default NoteDetails