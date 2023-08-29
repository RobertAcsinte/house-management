import { useEffect, useState } from 'react';
import { AppointmentType } from '../../AppointmentType';
import Avatar from '../../assets/avatar.jpeg';
import { useAuthContext } from '../../context/AuthContext';
import style from './AppointmentBox.module.css'
import { ClipLoader } from 'react-spinners';

type AppointmentBoxProps = {
  background: string,
  userId: string,
  name: string,
  startingTime: string,
  endingTime: string,
  showRemove: boolean,
  removeAppointment: () => void
}

function AppointmentBox({background, name, userId, startingTime, endingTime, showRemove, removeAppointment}: AppointmentBoxProps) {
  const context = useAuthContext()
  const [imgLoading, setImgLoading] = useState(true)
  const [photoURL, setPhotoURL] = useState<string>()
  const dateObjectStart = new Date(startingTime)
  const hoursStart = dateObjectStart.getHours() < 10 ? `0${dateObjectStart.getHours()}` : dateObjectStart.getHours()
  const minutesStart = dateObjectStart.getMinutes() < 10 ? `0${dateObjectStart.getMinutes()}` : dateObjectStart.getMinutes()
  const formattedTimeStart = `${hoursStart}:${minutesStart}`

  const dateObjectEnd = new Date(endingTime)
  const hoursEnd = dateObjectEnd.getHours() < 10 ? `0${dateObjectEnd.getHours()}` : dateObjectEnd.getHours()
  const minutesEnd = dateObjectEnd.getMinutes() < 10 ? `0${dateObjectEnd.getMinutes()}` : dateObjectEnd.getMinutes()
  const formattedTimeEnd = `${hoursEnd}:${minutesEnd}`

  function onDeleteButton() {
    removeAppointment()
  }

  function handleLoad () {
    setImgLoading(false)
  }

  useEffect(() => {
    const getPhoto = async () => {
      const defaultPhoto = await context.getAvatarURL(userId)
      if(defaultPhoto) {
        setPhotoURL(defaultPhoto)
      }
    }
    getPhoto()
  }, [])

  
  return (
    <div className={style.container} style={{background: background}}>
      {showRemove && <div className={style.removeButton} onClick={onDeleteButton}>X</div>}
      <div className={style.spinner} style={{ display: imgLoading ? "flex" : "none" }}>
        <div className={style.spinnerButton}>
          <ClipLoader color="var(--background)" size="63px" />
        </div>
      </div>
      <img className={style.avatar} src={photoURL} onLoad={handleLoad} style={{ display: imgLoading ? "none" : "block" }} alt="avatar" />
      <div className={style.textContainer}>
        <p className={style.name}>{name}</p>
        <p className={style.time}>{formattedTimeStart} - {formattedTimeEnd}</p>
      </div>
    </div>
  )
}

export default AppointmentBox