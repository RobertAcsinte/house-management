export function fieldNotEmpty(name: string, type: string, placeholder: string) {
  return {
    name: name,
    type: type,
    id: name,
    placeholder: placeholder,
    validation: {
      required: {
        value: true,
        message: 'This field is required',
      },
      maxLength: {
        value: 30,
        message: '30 characters max',
      },
    },
  }
}

export function passwordValidation(repeatPassword?: boolean) {
  return {
    name: repeatPassword ? 'repeatPassword' : 'password',
    type: 'password',
    id: repeatPassword ? 'repeatPassword' : 'password',
    placeholder: repeatPassword ? 'Repeat password' : 'Password',
    validation: {
      required: {
        value: true,
        message: 'This field is required',
      },
      minLength: {
        value: 6,
        message: 'The password must have at least 6 characters',
      },
    }
  }
}

export const emailValidation = {
    name: 'email',
    type: 'text',
    id: 'email',
    placeholder: 'Email',
    validation: {
      required: {
        value: true,
        message: 'This field is required',
      },
      maxLength: {
        value: 30,
        message: '30 characters max',
      },
    },
  }


