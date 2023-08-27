import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import { useEffect, useRef, useState } from 'react';
import style from './HomePage.module.css';
import { NoteDataDb, useNotesContext } from '../../context/NotesContext';
import NotesBox from '../../components/NoteBox/NotesBox';
import NoteDetails from '../../components/NoteDetails/NoteDetails';

function HomePage() {
  const [showModal, setShowModal] = useState<boolean>(false)
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
    modal.current = <NoteDetails setShowModal={setShowModal} note={note}/>
    document.body.style.overflow = 'hidden';
  }

  return (
    <>
      <Navbar showAllOptions/>
      <div className={style.wrapper}>
        <div className={style.category}>Pinned Notes</div>
        {
        showNotes 
          ? 
          <div className={style.notesGrid}>
            {notes}
          </div>
          :
          <div className={style.empty}>No pinned notes yet</div>
        }
      </div>
      {showModal && modal.current}
    </>
  )
}


 


export default HomePage