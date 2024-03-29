function mapErrorMessages(authCode: string) {
  switch (authCode) {
    case "auth/weak-password":
      return "The password must be at least 6 characters long."

    case "auth/missing-password":
      return "Please fill out the password fields."

    case "auth/invalid-email":
      return "The provided email doesn't have a valid format."

    case "auth/user-not-found":
      return "No user found."

    case "auth/wrong-password":
      return "Incorrect password."

    case "auth/too-many-requests":
      return "Too many requests, please try again later."

    case "auth/email-already-in-use":
      return "This email address is already in use."

    case "WEAK_PASSWORD : Password should be at least 6 characters":
      return "Password should be at least 6 characters."

    case "empty":
      return "It's empty here..."

    case "The starting date cannot be later than the ending date!":
      return "The starting date cannot be later than the ending date!"

    default:
      return "Unexpected error"
  }
}

export default mapErrorMessages