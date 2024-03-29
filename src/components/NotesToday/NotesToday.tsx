import { useEffect, useRef, useState } from 'react'
import style from './NotesToday.module.css'
import { NoteDataDb, useNotesContext } from '../../context/NotesContext'
import NotesBox from '../NoteBox/NotesBox'
import NoteDetails from '../NoteDetails/NoteDetails'
import { ClipLoader } from 'react-spinners'
import ModalAddEditNote from '../ModalAddEditNote/ModalAddEditNote'

function NotesToday() {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showModalEdit, setShowModalEdit] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const modal = useRef<JSX.Element | null>(null)
  const notesContext = useNotesContext()

  var showNotes = false
  
  notesContext.notes?.map((note) => {
    if(note.pinned) {
      showNotes = true
    }
  })

  const notes = notesContext.notes?.map((note) => {
    if(note.pinned) {
      return (
        <div className={style.centerGrid} key={note.id}>
          <NotesBox note={note} onNoteClick={
            () => onNoteClick(note)
            }/>
        </div>
      )
    }
  })
  
  const onNoteClick = (note: NoteDataDb) => {
    setShowModal(true)
    modal.current = <NoteDetails setShowModal={setShowModal} note={note} onNoteUpdateFunction={onNoteUpdate}/>
    document.body.style.overflow = 'hidden';
  }

  const onNoteUpdate = (note: NoteDataDb) => {
    setShowModal(false)
    setShowModalEdit(true)
    document.body.style.overflow = 'hidden';
    modal.current = 
      <ModalAddEditNote
        id={note.id}
        title={note.title}
        content={note.content}
        pinned={note.pinned}
        setShowModal={setShowModalEdit}
      />
  }

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        await notesContext.getNotes()
        setLoading(false)
      } catch(error: any) {
        setLoading(false)
      }
    }
    fetchNotes()
  }, [])

  return (
    <>
      {loading ?
        <div className='spinner-button'>
          <ClipLoader color="var(--secondary)" size="50px" />
        </div>
        :
        <>
          {
            showNotes ?
              <div className={style.notesGrid}>
                {notes}
              </div> :
              <div className={style.empty}>No pinned notes yet</div>
          }
        </>
      }
      {showModal && modal.current}
      {showModalEdit && modal.current}
    </>
  )
}

export default NotesToday