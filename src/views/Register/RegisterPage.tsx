import style from './RegisterPage.module.css'
import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom'
import { BeatLoader } from 'react-spinners';
import mapFirebaseErrorMessages from '../../mapFirebaseErrorMessages';
import { getDatabase, ref, set } from "firebase/database";

interface RegisterFormState {
  email: string,
  name: string,
  password: string,
  repeatPassword: string,
  [key: string]: string;
}


function RegisterPage() {

  const auth = getAuth();
  const database = getDatabase();

  const navigate = useNavigate();
  const [registerForm, setRegisterForm] = useState<RegisterFormState>({
    email: "",
    name: "",
    password: "",
    repeatPassword: ""
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    for(const key in registerForm) {
      if(registerForm[key] === "") {
        setError("Please fill out all the fields.")
        return
      }
    }
    if(registerForm.password !== registerForm.repeatPassword) {
      setError("Passwords don't match!")
      return
    }
    register()
  }

  const register = () => {
    setLoading(true)
    createUserWithEmailAndPassword(auth, registerForm.email, registerForm.password)
    .then((userCredential) => {
      set(ref(database, 'users/' + userCredential.user.uid), {
        email: registerForm.email,
        name: registerForm.name,
      });
      //login automatically after register
       login()
    })
    .catch((error) => {
      setLoading(false)
      setError(mapFirebaseErrorMessages(error.code))
    })
  }

  const login = () => {
    signInWithEmailAndPassword(auth, registerForm.email, registerForm.password)
      .then(() => {
        setLoading(false)
        navigate("/")
      })
      .catch((error) => {
        setLoading(false)
        setError(mapFirebaseErrorMessages(error.code))
      })
  }

  // function writeUserData(userId: string, name: , email, imageUrl) {
  //   const db = getDatabase();
  //   set(ref(db, 'users/' + userId), {
  //     username: name,
  //     email: email,
  //     profile_picture : imageUrl
  //   });
  // }

  return (
      <>
      <div className={style.wrapper}>
        <div className={style["box-container"]}>
          <div className={style.title}>Create Account</div>
          <form onSubmit={event => onSubmit(event)}>
            <input type="text" placeholder='Email' value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})}/>
            <input type="text" placeholder='Name'value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})}/>
            <input type="password" placeholder='Password'value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})}/>
            <input type="password" placeholder='Repeat Password'value={registerForm.repeatPassword} onChange={e => setRegisterForm({...registerForm, repeatPassword: e.target.value})}/>
            {loading ? <span><BeatLoader color="rgb(155, 167, 177)" size="30px" /> </span>: <input type="submit" value="Register" className={style.button} />}
          </form>
          <div className={style.error}>{error}</div>
        </div>
      </div>
      </>    
  )
}

export default RegisterPage;


// function useFirebaseAuth() {
//   const login = (email:string, password:string) => {
//     signInWithEmailAndPassword(auth, email, password)
//       .then(() => {
//         navigate("/")
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//       });
//   }

//   return {
//     login
//   }
// }