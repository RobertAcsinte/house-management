import { ClipLoader } from 'react-spinners';
import { useState } from 'react';
import { useAuthContext } from '../../../context/AuthContext.tsx';
import mapErrorMessages from '../../../mapErrorMessages.tsx';
import Modal from '../../../components/ModalInfo/ModalInfo.tsx';
import Logo from '../../../assets/logo.svg';
import {FormProvider, useForm} from "react-hook-form";
import Input from "../../../components/Input/Input.tsx";
import {email_validation, password_validation} from "../../../utils/validations.tsx";
import {useAppDispatch, useAppSelector} from "../../../withTypes.ts";
import {loginUser, resetPasswordUser} from "../usersSlice.ts";

type Input = {
  email: string
}

function ResetPassword() {
  const dispatch = useAppDispatch()
  const methods = useForm<Input>()
  const {error, status} = useAppSelector(state => state.user)

  const onSubmit = methods.handleSubmit(async (data: Input) => {
    dispatch(resetPasswordUser(data.email))
  })

  // const context = useAuthContext()
  // const [loading, setLoading] = useState<boolean>(false)
  // const [error, setError] = useState<string | null>(null)
  // const [showModal, setShowModal] = useState(false)

  // const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()

  //   const formData = new FormData(e.currentTarget)
  //   const email = formData.get("email") as string
  //
  //   if(!email) {
  //     setError("Please fill out the email field.")
  //     return
  //   }
  //   setLoading(true)
  //
  //   try {
  //     await context.resetPassword(email)
  //     setLoading(false)
  //     setShowModal(true)
  //   } catch(error) {
  //     setLoading(false)
  //     if(typeof error === "string") {
  //       setError(mapErrorMessages(error))
  //     }
  //   }
  // }

  return (
      <main>
        <h1 className="visually-hidden">WeShare Login Reset Password Page</h1>
        <section className='wrapper center'>
          <div className='box'>
            <img className='logo' src={Logo} alt="WeShare logo"/>
            <FormProvider {...methods}>
              <form onSubmit={onSubmit}>
                <Input {...email_validation} />
                {status === "pending" ? (
                    <div className='spinner-container'>
                      <ClipLoader color="var(--secondary)" size="50px"/>
                    </div>
                ) : (
                    <button type="submit" value="Login" className='button-primary'>Reset Password</button>
                )}
              </form>
            </FormProvider>
            {status === "rejected" && <p className='error-text' role="alert">{error}</p>}
          </div>
        </section>
      </main>
  )
}

export default ResetPassword