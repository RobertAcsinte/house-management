import style from './NotesBox.module.css'

type NotesBoxProps = {
  title: string,
  content: string,
  date: number,
  user: string
}

function NotesBox({title, content, date, user}: NotesBoxProps) {
  var minutes: string | number = new Date(date).getMinutes() 
  var hours: string | number = new Date(date).getHours() 

  if(minutes < 10) {
    minutes = "0" + minutes
  }

  if(hours < 10) {
    hours = "0" + hours
  }

  return (
    <div className={style.container}>
      <p className={style.title}>{title}</p>
      <b>{user}</b>
      <p className={style.date}>{new Date(date).toLocaleDateString("nl-NL")} {hours}:{minutes}</p>
      <p className={style.content}>{content}</p>
    </div>
  )
}

export default NotesBox