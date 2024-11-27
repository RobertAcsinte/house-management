import { useFormContext } from "react-hook-form"
import style from './Input.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons"

type InputProps = {
    type: string,
    id: string,
    placeholder?: string,
    validation?: object,
    name: string,
    customStyle?: string,
    label?: string
}

type InputError = {
    error: {
        message: string,
        type: string,
        ref: unknown
    }
}

export const Input = ({ type, id, placeholder, validation, name, label }: InputProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext()

    const inputError = Object.keys(errors)
        .filter(key => key.includes(name))
        .reduce((cur, key) => {
            return Object.assign(cur, {error: errors[key]})
        }, {} as InputError)

    const isInvalid = Object.keys(inputError).length > 0

    return (
        <div className={style[type !== 'checkbox' ? 'input-container' : 'checkbox-container']}>
            {isInvalid && (
                <div className={style.error}>
                    <FontAwesomeIcon icon={faCircleExclamation}/> <span role="alert">{inputError.error.message}</span>
                </div>
            )}
            <input
                id={id}
                className={style[type !== 'checkbox' ? 'input-field' : 'checkbox']}
                type={type}
                placeholder={placeholder}
                aria-label={name}
                {...register(name, validation)}
            />
            {type === 'checkbox' && <label htmlFor={id}>{label}</label>}
        </div>
    )
}

export default Input;