import { useRef, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import style from './NotesPage.module.css'
import ModalAddNote from '../../components/ModalAddNote/ModalAddNote'

function NotesPage() {
  const [showModal, setShowModal] = useState<boolean>(false)
  const modal = useRef<JSX.Element | null>(null)

  const onAddButton = () => {
    setShowModal(true)
    modal.current = <ModalAddNote setShowModal={setShowModal}/>
  }

  return (
    <>
      <Navbar showAllOptions/>
      <div className={style.buttonContainer}>
          <button className='full-button-small' onClick={onAddButton}>Add Note</button>
      </div>
      {showModal && modal.current}
    </>
  )
}

export default NotesPage