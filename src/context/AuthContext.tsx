import React, { useState, useEffect, useContext } from "react"
import { ClipLoader } from 'react-spinners';
import { auth, db } from "../firebaseConfig"
import { User, UserCredential, browserLocalPersistence } from "firebase/auth"
import { ref, set, onValue } from "firebase/database";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, browserSessionPersistence, setPersistence, updateEmail, reauthenticateWithCredential, updatePassword, signOut } from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth/cordova";

interface AuthContextValue {
  currentUser: User | null,
  currentUserDataDb: any | null
  login: (email: string, password: string, stayLogged: boolean) => Promise<UserCredential>
  logout(): Promise<void>
  register: (email: string, password: string) => Promise<UserCredential>
  saveUserDb: (userId: string, email: string, name: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  getUserData: (uid: string) => void
  updateEmailUser(email: string): Promise<unknown>
  updatePasswordUser(newPassword: string): Promise<void>
  reauthenticateUser(password: string): Promise<UserCredential>
  updateName: (name: string) => Promise<void>
}

export function useAuthContext() {
  return useContext(AuthContext)
}

const AuthContext = React.createContext({} as AuthContextValue);

export function AuthProvider({ children }: {children: React.ReactNode}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentUserDataDb, setCurrentUserDataDb] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  function register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function login(email: string, password: string, stayLogged: boolean) {
    if(stayLogged) {
      setPersistence(auth, browserLocalPersistence)
    }
    else {
      setPersistence(auth, browserSessionPersistence)
    }
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return signOut(auth)
  }

  function saveUserDb(userId: string, email: string, name: string) {
    return set(ref(db, 'users/' + userId), {
      email: email,
      name: name
    });
  }

  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email)
  }

  function getUserData(uid: string) {
    const starCountRef = ref(db, 'users/' + uid);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setCurrentUserDataDb(data)
      setLoading(false)
    });
  }

  function updateName(name: string) {
    return set(ref(db, 'users/' + currentUser?.uid), 
      {
        ...currentUserDataDb,
        name: name
      }
    );
  }

  async function updateEmailUser(email: string) {    
    return updateEmail(currentUser!, email).then(() => {
      return set(ref(db, 'users/' + currentUser?.uid), 
        {
          ...currentUserDataDb,
          email: email
        }
      )
    })
    .catch((error) => {
      return new Promise((resolve, reject) => {
        reject(error.code)
      })
    })
  }

  function updatePasswordUser(newPassword: string) {
    return updatePassword(currentUser!, newPassword)
  }

  function reauthenticateUser(password: string) {
    return reauthenticateWithCredential(currentUser!, EmailAuthProvider.credential(currentUser!.email!, password))
  }

  const value: AuthContextValue = {
    currentUser: currentUser,
    currentUserDataDb: currentUserDataDb,
    login,
    logout,
    register,
    saveUserDb,
    resetPassword,
    getUserData,
    updateEmailUser,
    updatePasswordUser,
    reauthenticateUser,
    updateName
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      getUserData(user?.uid!)  
    })
    
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={value}>
      { loading ? 
      <>
        <div className='center-wrapper'>
          <ClipLoader color="var(--orange)" size="200px" /> 
          </div>
      </>

      : children }

    </AuthContext.Provider>
  )


}