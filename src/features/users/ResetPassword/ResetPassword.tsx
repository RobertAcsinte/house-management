import { ClipLoader } from 'react-spinners';
import Modal from '../../../components/ModalInfo/ModalInfo.tsx';
import Logo from '../../../assets/logo.svg';
import {FormProvider, useForm} from "react-hook-form";
import Input from "../../../components/Input/Input.tsx";
import {emailValidation} from "../../../utils/validations.tsx";
import {useAppDispatch, useAppSelector} from "../../../withTypes.ts";
import {resetPasswordUser} from "../usersSlice.ts";

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

  return (
      <main>
        <h1 className="visually-hidden">WeShare Login Reset Password Page</h1>
        <section className='wrapper center'>
          <div className='box'>
            <img className='logo' src={Logo} alt="WeShare logo"/>
            <FormProvider {...methods}>
              <form onSubmit={onSubmit}>
                <Input {...emailValidation} />
                {status === "pending" ? (
                    <div className='spinner-container'>
                      <ClipLoader color="var(--secondary)" size="50px"/>
                    </div>
                ) : (
                    <button type="submit" value="reset" className='button-primary'>Reset Password</button>
                )}
              </form>
            </FormProvider>
            {status === "rejected" && <p className='error-text' role="alert">{error}</p>}
          </div>
        </section>
        {status === "fulfilled" && <Modal navigateRoute={'/'} text={'Confirmation sent, please check your email.'}></Modal>}
      </main>
  )
}

export default ResetPassword