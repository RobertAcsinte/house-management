export const email_validation = {
    name: 'email',
    type: 'text',
    id: 'email',
    placeholder: 'email',
    validation: {
      required: {
        value: true,
        message: 'required',
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
    placeholder: 'password',
    validation: {
      required: {
        value: true,
        message: 'required',
      },
      minLength: {
        value: 6,
        message: 'min 6 characters',
      },
    },
  }
