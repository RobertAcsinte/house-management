import { PushPin } from '@mui/icons-material'
import style from './NotesBox.module.css'
import { NoteDataDb } from '../../context/NotesContext'
import Avatar from '../../assets/avatar.jpeg';

type NotesBoxProps = {
  note: NoteDataDb
  onNoteClick: () => void
}

function NotesBox({note, onNoteClick}: NotesBoxProps) {
  var minutes: string | number = new Date(note.date).getMinutes() 
  var hours: string | number = new Date(note.date).getHours() 

  if(minutes < 10) {
    minutes = "0" + minutes
  }

  if(hours < 10) {
    hours = "0" + hours
  }

  return (
    <div className={style.container} onClick={onNoteClick}>
      {note.pinned && <PushPin className={style.pin} />}
      <p className={style.title}>{note.title}</p>
      <div className={style.noteDetails}>
          <img className={style.avatar} src={Avatar} alt="avatar" />
          <div className={style.noteDetailsText}>
            <p></p><b>{note.userName}</b>
            <p>{new Date(note.date).toLocaleDateString("nl-NL")} {hours}:{minutes}</p>
          </div>
      </div>
      <p className={style.content}>{note.content}</p>
    </div>
  )
}

export default NotesBox