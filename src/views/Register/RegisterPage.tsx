import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import mapErrorMessages from '../../mapErrorMessages';
import { useAuthContext } from '../../context/AuthContext';
import Logo from '../../assets/logo.png';
import { updateProfile } from 'firebase/auth';
import style from './RegisterPage.module.css'


function RegisterPage() {

  const context = useAuthContext()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [imgLoading, setImgLoading] = useState(true)
  const [photoURL, setPhotoURL] = useState<string>()
  const [file, setFile] = useState<Blob | Uint8Array | ArrayBuffer>()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const password = formData.get("password") as string
    const repeatPassword = formData.get("repeatPassword") as string

    if (!email || !name || !password || !repeatPassword) {
      setError("Please fill out all the fields.")
      return
    }
    if (repeatPassword !== password) {
      setError("Passwords don't match.")
      return
    }

    setLoading(true)


    const userCredential = await context.register(email, password).catch((registerError) => {
      setLoading(false)
      setError(mapErrorMessages(registerError.code))
    })

    if (userCredential) {
      if(file) {
        await context.uploadAvatar(file).catch((error) => {
          setLoading(false)
          setError(error)
        })
      } else {
        const path = "../../../public/default.png"
        const response = await fetch(path);
        const blob = await response.blob();
        await context.uploadAvatar(blob).catch((error) => {
          setLoading(false)
          setError(error)
        })
      }
      
      await context.saveUserDb(userCredential.user.uid, email, name).catch((registerError) => {
        setLoading(false)
        setError(mapErrorMessages(registerError.code))
      })
      await context.login(email, password, true).catch((loginError) => {
        setLoading(false)
        setError(mapErrorMessages(loginError.code))
      })
      setLoading(false)
    }
  }

  function handleLoad () {
    setImgLoading(false)
  }

  const loadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
      setPhotoURL(URL.createObjectURL(event.target.files[0]));
      setError(null)
    }
  }

  useEffect(() => {
    const getDefaultPhoto = async () => {
      const defaultPhoto = await context.getAvatarURL("default.png").catch(setError)
      if(defaultPhoto) {
        setPhotoURL(defaultPhoto)
      }
    }
    getDefaultPhoto()
  }, [])

  return (
    <>
      <div className='center-wrapper-nonav'>
        <div className='box-container'>
          <div style={{display: imgLoading ? "block" : "none"}}>
            <div className='spinner-button'>
              <ClipLoader color="var(--secondary)" size="50px" />
            </div>
          </div>
          <img className={style.avatar} src= {photoURL} onLoad={handleLoad} style={{display: imgLoading ? "none" : "block"}}/>
          <label className={style.custom}>
          <input type="file" onChange={loadFile} accept="image/*"/>
          Select photo
          </label>
          <form onSubmit={event => onSubmit(event)}>
            <input type="text" placeholder='Email' name='email' />
            <input type="text" placeholder='Name' name='name' />
            <input type="password" placeholder='Password' name='password' />
            <input type="password" placeholder='Repeat Password' name='repeatPassword' />
            {loading ? <div className='spinner-button' style={{marginTop:"65px"}}><ClipLoader color="var(--secondary)" size="50px" /> </div> : <button type="submit" className='full-button'>Register</button>}
          </form>
          <div className='error-text'>{error}</div>
        </div>
      </div>
    </>
  )
}

export default RegisterPage;
