import { AppointmentType } from '../../AppointmentType';
import Avatar from '../../assets/avatar.jpeg';
import style from './AppointmentBox.module.css'

type AppointmentBoxProps = {
  name: string,
  startingTime: string,
  endingTime: string,
  showRemove: boolean,
  removeAppointment: () => void
}

function AppointmentBox({name, startingTime, endingTime, showRemove, removeAppointment}: AppointmentBoxProps) {
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
  
  return (
    <div className={style.container}>
      {showRemove && <div className={style.removeButton} onClick={onDeleteButton}>X</div>}
      <img className={style.avatar} src={Avatar} alt="avatar" />
      <div className={style.textContainer}>
        <p className={style.name}>{name}</p>
        <p className={style.time}>{formattedTimeStart} - {formattedTimeEnd}</p>
      </div>
    </div>
  )
}

export default AppointmentBox