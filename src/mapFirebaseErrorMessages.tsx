function mapFirebaseErrorMessages(authCode: string) {
  switch (authCode) {
    case "auth/weak-password":
      return "The password must be at least 6 characters long."

    case "auth/missing-password":
      return "Please fill out the password fields."

    case "auth/invalid-email":
      return "The provided email doesn't have a valid format."

    default:
      return "Unexpected error"
  }
}

export default mapFirebaseErrorMessages