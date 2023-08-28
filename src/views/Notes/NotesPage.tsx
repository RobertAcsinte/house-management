import { useEffect, useRef, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import style from './NotesPage.module.css'
import ModalAddNote from '../../components/ModalAddEditNote/ModalAddEditNote'
import { NoteDataDb, useNotesContext } from '../../context/NotesContext'
import NotesBox from '../../components/NoteBox/NotesBox'
import NoteDetails from '../../components/NoteDetails/NoteDetails'
import { ClipLoader } from 'react-spinners'

function NotesPage() {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const modal = useRef<JSX.Element | null>(null)
  const notesContext = useNotesContext()


  const onAddButton = () => {
    setShowModal(true)
    modal.current = <ModalAddNote setShowModal={setShowModal}/>
  }

  const onNoteClick = (note: NoteDataDb) => {
    setShowModal(true)
    modal.current = <NoteDetails setShowModal={setShowModal} note={note}/>
    document.body.style.overflow = 'hidden';
  }

  const notes = notesContext.notes?.map((note) => {
    return (
        <div className={style.centerGrid} key={note.id}>
          <NotesBox note={note} onNoteClick={
            () => onNoteClick(note)
            }/>
        </div>
      )
  })

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
      <Navbar showAllOptions />
      <div className={style.addContainer}>
        <button className='full-button-small' onClick={onAddButton}>
          Add a note
        </button>
      </div>
      {loading ?
        <div className='spinner-button'>
          <ClipLoader color="var(--secondary)" size="200px" />
        </div>
        :
        <>
          {notesContext.error ?
            <div className='error-wrapper'>
              {notesContext.error}
            </div>
            :
            <div className={style.notesGrid}>
              {notes}
            </div>
          }
        </>
      }
      {showModal && modal.current}
    </> 
  )
}

export default NotesPage