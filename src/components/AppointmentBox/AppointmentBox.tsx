import Avatar from '../../assets/avatar.jpeg';
import style from './AppointmentBox.module.css'

type AppointmentBoxProps = {
  name: string,
  startingTime: string,
  endingTime: string
}

function AppointmentBox({name, startingTime, endingTime}: AppointmentBoxProps) {
  const timestampStart = startingTime
  const dateObjectStart = new Date(timestampStart)
  const hoursStart = dateObjectStart.getUTCHours() < 10 ? `0${dateObjectStart.getUTCHours()}` : dateObjectStart.getUTCHours()
  const minutesStart = dateObjectStart.getUTCMinutes() < 10 ? `0${dateObjectStart.getUTCMinutes()}` : dateObjectStart.getUTCMinutes()
  const formattedTimeStart = `${hoursStart}:${minutesStart}`

  const timestampEnd = endingTime
  const dateObjectEnd = new Date(timestampEnd)
  const hoursEnd = dateObjectEnd.getUTCHours() < 10 ? `0${dateObjectEnd.getUTCHours()}` : dateObjectEnd.getUTCHours()
  const minutesEnd = dateObjectEnd.getUTCMinutes() < 10 ? `0${dateObjectEnd.getUTCMinutes()}` : dateObjectEnd.getUTCMinutes()
  const formattedTimeEnd = `${hoursEnd}:${minutesEnd}`

  return (
    <div className={style.container}>
      <img className={style.avatar} src={Avatar} alt="avatar" />
      <div className={style.textContainer}>
        <p className={style.name}>{name}</p>
        <p className={style.time}>{formattedTimeStart} - {formattedTimeEnd}</p>
      </div>
    </div>
  )
}

export default AppointmentBox