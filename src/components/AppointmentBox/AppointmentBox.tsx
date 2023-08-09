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
  console.log(dateObjectStart)
  const hoursStart = dateObjectStart.getHours() < 10 ? `0${dateObjectStart.getHours()}` : dateObjectStart.getHours()
  const minutesStart = dateObjectStart.getMinutes() < 10 ? `0${dateObjectStart.getMinutes()}` : dateObjectStart.getMinutes()
  const formattedTimeStart = `${hoursStart}:${minutesStart}`

  const timestampEnd = endingTime
  const dateObjectEnd = new Date(timestampEnd)
  const hoursEnd = dateObjectEnd.getHours() < 10 ? `0${dateObjectEnd.getHours()}` : dateObjectEnd.getHours()
  const minutesEnd = dateObjectEnd.getMinutes() < 10 ? `0${dateObjectEnd.getMinutes()}` : dateObjectEnd.getMinutes()
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