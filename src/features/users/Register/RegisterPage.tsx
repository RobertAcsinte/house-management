import React, {useRef, useState} from 'react';
import { ClipLoader } from 'react-spinners';
import Avatar from '../../../assets/default.png'
import style from './RegisterPage.module.scss'
import {FormProvider, useForm} from "react-hook-form";
import Input from "../../../components/Input/Input.tsx";
import {emailValidation, fieldNotEmpty, passwordValidation} from "../../../utils/validations.tsx";
import {useAppDispatch, useAppSelector} from "../../../withTypes.ts";
import {registerUser} from "../usersSlice.ts";


type Inputs = {
  email: string,
  name:string,
  password: string,
  repeatPassword: string
}

function RegisterPage() {
  const methods = useForm<Inputs>()
  const dispatch = useAppDispatch()
  const {error, status} = useAppSelector(state => state.user)
  const [photoURL, setPhotoURL] = useState<string>()
  const fileRef = useRef<Blob | Uint8Array | ArrayBuffer>()

  const onSubmit = methods.handleSubmit(async (data: Inputs) => {
    dispatch(registerUser({
      email: data.email, displayName: data.name, password: data.password, repeatPassword: data.repeatPassword, avatar: fileRef.current}))
  })

  const loadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      fileRef.current = event.target.files[0]
      setPhotoURL(URL.createObjectURL(event.target.files[0]));
    }
  }

  return (
      <main>
        <h1 className="visually-hidden">WeShare Register Page</h1>
        <section className='wrapper center'>
          <div className='box'>
            <img className={style.avatar} src={photoURL || Avatar} alt="Picked avatar"/>
            <label className={style['custom-select-file-label']}>
              <input type="file" onChange={loadFile} accept="image/*"/>
              Select photo
            </label>
            <FormProvider {...methods}>
              <form onSubmit={onSubmit}>
                <Input {...emailValidation} />
                <Input {...fieldNotEmpty("name", "text", "Name")} />
                <Input {...passwordValidation()} />
                <Input {...passwordValidation(true)} />
                {status === "pending" ? (
                    <div className='spinner-container'>
                      <ClipLoader color="var(--secondary)" size="50px"/>
                    </div>
                ) : (
                    <button type="submit" value="Register" className='button-primary'>Register</button>
                )}
              </form>
            </FormProvider>
            {status === "rejected" && <p className='error-text' role="alert">{error}</p>}
          </div>
        </section>
      </main>
  )
}

export default RegisterPage;
