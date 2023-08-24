import style from './NotesBox.module.css'

type NotesBoxProps = {
  title: string,
  content: string,
  date: number,
  user: string
}

function NotesBox({title, content, date, user}: NotesBoxProps) {
  return (
    <div className={style.container}>
      <p className={style.title}>{title}</p>
      <b>{user}</b>
      <p className={style.date}>{new Date(date).toLocaleDateString("nl-NL")} {new Date(date).getHours()}:{new Date(date).getMinutes()}</p>
      <p className={style.content}>{content}</p>
    </div>
  )
}

export default NotesBox