import { useRef, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import style from './NotesPage.module.css'
import ModalAddNote from '../../components/ModalAddNote/ModalAddNote'
import { useNotesContext } from '../../context/NotesContext'
import NotesBox from '../../components/NoteBox/NotesBox'

function NotesPage() {
  const [showModal, setShowModal] = useState<boolean>(false)
  const modal = useRef<JSX.Element | null>(null)
  const notesContext = useNotesContext()

  const onAddButton = () => {
    setShowModal(true)
    modal.current = <ModalAddNote setShowModal={setShowModal}/>
  }

  const notes = notesContext.notes?.map((note) => {
    return <NotesBox key={note.id} title={note.title} date={note.date} content={note.content} user={note.userName}/>
  })

  return (
    <>
      <Navbar showAllOptions/>
      <div className={style.buttonContainer}>
          <button className='full-button-small' onClick={onAddButton}>Add Note</button>
      </div>
      <div className={style.notesGrid}>
        {notes}
      </div>
      {showModal && modal.current}
    </>
  )
}

export default NotesPage