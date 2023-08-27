import { useEffect, useRef, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import style from './NotesPage.module.css'
import ModalAddNote from '../../components/ModalAddEditNote/ModalAddEditNote'
import { NoteDataDb, useNotesContext } from '../../context/NotesContext'
import NotesBox from '../../components/NoteBox/NotesBox'
import NoteDetails from '../../components/NoteDetails/NoteDetails'

function NotesPage() {
  const [showModal, setShowModal] = useState<boolean>(false)
  const modal = useRef<JSX.Element | null>(null)
  const notesContext = useNotesContext()
  const [isMobile, setIsMobile] = useState<boolean>(false)

  const onAddButton = () => {
    setShowModal(true)
    modal.current = <ModalAddNote setShowModal={setShowModal}/>
  }

  const onNoteClick = (note: NoteDataDb) => {
    setShowModal(true)
    modal.current = <NoteDetails setShowModal={setShowModal} note={note}/>
    document.body.style.overflow = 'hidden';
  }

  const handleResize = () => {
    if(window.innerWidth <= 800) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
  }, [])

  var gridStyle = 'repeat(auto-fit, minmax(200px, 300px))'
  var gridGap = '40px'

  if(notesContext.notes){
    if(notesContext.notes.length > 2 || isMobile) {
      gridStyle = 'repeat(auto-fit, minmax(300px, 1fr))'
      gridGap = '20px'
    } 
    
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

  return (
    <>
      <Navbar showAllOptions/>
      <div className={style.addContainer}>
        <button className='full-button-small' onClick={onAddButton}>
          Add a note
        </button>
      </div>
      <div className={style.notesGrid} style={{gridTemplateColumns: gridStyle, columnGap: gridGap}}>
          {notes}
      </div>
      <div className='error-wrapper'>
        {notesContext.error}
      </div>
      {showModal && modal.current}
    </>
  )
}

export default NotesPage