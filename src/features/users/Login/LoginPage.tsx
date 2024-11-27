import style from './LoginPage.module.scss'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners';
import Logo from '../../../assets/logo.svg';
import Input from '../../../components/Input/Input.tsx';
import { FormProvider, useForm } from 'react-hook-form';
import {emailValidation, fieldNotEmpty} from '../../../utils/validations.tsx';
import {useAppDispatch, useAppSelector} from "../../../withTypes.ts";
import {loginUser} from "../usersSlice.ts";

type Inputs = {
    email: string,
    password:string,
    checkboxRemember: boolean
}

function LoginPage() {
    const navigate = useNavigate()
    const methods = useForm<Inputs>()
    const dispatch = useAppDispatch()
    const {error, status} = useAppSelector(state => state.user)

    const onSubmit = methods.handleSubmit(async (data: Inputs) => {
        dispatch(loginUser({email: data.email, password: data.password, stayLogged: data.checkboxRemember}))
    })

    return (
        <main>
            <h1 className="visually-hidden">WeShare Login Page</h1>
            <section className='wrapper center'>
                <div className='box'>
                    <img className='logo' src={Logo} alt="WeShare logo"/>
                    <FormProvider {...methods}>
                        <form onSubmit={onSubmit}>
                            <Input {...emailValidation} />
                            <Input {...fieldNotEmpty("password", "password", "Password")} />
                            <div className={style['actions-container']}>
                                <Input type='checkbox' id='checkbox-remember' name='checkboxRemember' label='Remember me'/>
                                <button type='button' className='text-button' onClick={() => navigate("/resetpassword")}>Reset password</button>
                            </div>
                            {status === "pending" ? (
                                <div className='spinner-container'>
                                    <ClipLoader color="var(--secondary)" size="50px"/>
                                </div>
                            ) : (
                                <button type="submit" value="Login" className='button-primary'>Login</button>
                            )}
                        </form>
                    </FormProvider>
                    {status === "rejected" && <p className='error-text' role="alert">{error}</p>}
                    <button type='button' id={style['register-button']} className='text-button' onClick={() => navigate("/register")}>No account? <span>Click here!</span></button>
                </div>
            </section>
        </main>
    )
}

export default LoginPage