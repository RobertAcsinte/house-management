export const email_validation = {
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

  export const password_validation = {
    name: 'password',
    type: 'password',
    id: 'password',
    placeholder: 'Password',
    validation: {
      required: {
        value: true,
        message: 'This field is required',
      },
      minLength: {
        value: 6,
        message: 'The password must have at least 6 characters',
      },
    },
  }
