import { useRef, useState } from 'react'
import style from './ModalChangePhoto.module.css'
import { ClipLoader } from 'react-spinners'
import { useAuthContext } from '../../context/AuthContext'
import { UploadResult } from 'firebase/storage'

type ModalProps =  {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  uploadFile(file: Blob | Uint8Array | ArrayBuffer): Promise<any>
}

function ModalChangePhoto({setShowModal, uploadFile}: ModalProps) {
  const context = useAuthContext();
  const [photoURL, setPhotoURL] = useState<string>(context.currentUser!.photoURL!)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const fileRef = useRef<Blob | Uint8Array | ArrayBuffer>()

  const handleButtonClickConfirm = () => {
    setLoading(true)
    if(fileRef.current !== undefined) {
      uploadFile(fileRef.current).then(() => {
        setShowModal(false)
        setLoading(false)
      }).catch((error) => {
        setError((error))
        setLoading(false)
      })
    } else {
      setError("No file selected")
      setLoading(false)
    }
}

const handleButtonClickClose = () => {
  setShowModal(false)
}

const loadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files[0]) {
    fileRef.current = event.target.files[0]
    setPhotoURL(URL.createObjectURL(event.target.files[0]));
  }
}



return (
  <div className={style.wrapper}>
    <div className='center-wrapper'>
      <div className={style['box-container-modal']}>
        <div className={style['large-title-modal']}>Change your photo</div>
        <img className={style.avatar} src= {photoURL}/>
        <label className={style.custom}>
          <input type="file" onChange={loadFile} accept="image/*"/>
          Select photo
        </label>
        <div className='error-text'>{error}</div>
        <div className={style.buttonsContainer}>
          {loading ? <div className='spinner-button'><ClipLoader color="var(--secondary)" size="50px" /> </div> :
            <div><button className='full-button' style={{ flex: "1" }} onClick={handleButtonClickConfirm}>Confirm</button>
              <button className='empty-button' style={{ flex: "1" }} onClick={handleButtonClickClose}>Cancel</button></div>
          }
        </div>
      </div>
    </div>
  </div>
)

}





export default ModalChangePhoto