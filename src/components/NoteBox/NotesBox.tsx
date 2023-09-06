import { PushPin } from '@mui/icons-material'
import style from './NotesBox.module.css'
import { NoteDataDb } from '../../context/NotesContext'
import Avatar from '../../assets/avatar.jpeg';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { ClipLoader } from 'react-spinners';

type NotesBoxProps = {
  note: NoteDataDb
  onNoteClick: () => void
}

function NotesBox({note, onNoteClick}: NotesBoxProps) {
  const context = useAuthContext()
  const [imgLoading, setImgLoading] = useState(true)
  const [photoURL, setPhotoURL] = useState<string>()
  var minutes: string | number = new Date(note.date).getMinutes() 
  var hours: string | number = new Date(note.date).getHours() 

  if(minutes < 10) {
    minutes = "0" + minutes
  }

  if(hours < 10) {
    hours = "0" + hours
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

  return (
    <div className={style.container} onClick={onNoteClick}>
      {note.pinned && <PushPin className={style.pin} />}
      <p className={style.title}>{note.title}</p>
      <div className={style.noteDetails}>
        <div className={style.spinner} style={{ display: imgLoading ? "flex" : "none" }}>
          <div className={style.spinnerButton}>
            <ClipLoader color="var(--secondary)" size="45px" />
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
      <p className={style.content}>{note.content}</p>
    </div>
  )
}

export default NotesBox