import React, { useState, useEffect, useContext } from "react"
import { ClipLoader } from 'react-spinners';
import { auth, db } from "../firebaseConfig"
import { User, UserCredential, browserLocalPersistence } from "firebase/auth"
import { ref, set, onValue } from "firebase/database";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, browserSessionPersistence, setPersistence, updateEmail, reauthenticateWithCredential, updatePassword, signOut } from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth/cordova";


export interface UserDataDb {
  uid: string
  email: string,
  name: string, 
  houseId: string | undefined
  invitationsReceivedHouseId: [string] | undefined,
}

interface AuthContextValue {
  currentUser: User | null,
  currentUserDataDb: UserDataDb | null
  login(email: string, password: string, stayLogged: boolean): Promise<UserCredential>
  logout(): Promise<void>
  register: (email: string, password: string) => Promise<UserCredential>
  saveUserDb(userId: string, email: string, name: string): Promise<void>
  resetPassword(email: string): Promise<void>
  getUserData(uid: string): void
  updateEmailUser(email: string): Promise<unknown>
  updatePasswordUser(newPassword: string): Promise<void>
  reauthenticateUser(password: string): Promise<UserCredential>
  updateName(name: string): Promise<void>
}

export function useAuthContext() {
  return useContext(AuthContext)
}

const AuthContext = React.createContext({} as AuthContextValue);

export function AuthProvider({ children }: {children: React.ReactNode}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentUserDataDb, setCurrentUserDataDb] = useState<UserDataDb | null>(null)
  const [loading, setLoading] = useState(true)

  function register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function login(email: string, password: string, stayLogged: boolean): Promise<UserCredential> {
    if(stayLogged) {
      setPersistence(auth, browserLocalPersistence)
    }
    else {
      setPersistence(auth, browserSessionPersistence)
    }
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout(): Promise<void> {
    return signOut(auth)
  }

  function saveUserDb(userId: string, email: string, name: string): Promise<void> {
    return set(ref(db, 'users/' + userId), {
      email: email,
      name: name
    });
  }

  function resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email)
  }

  function getUserData(uid: string): void {
    const refDb = ref(db, 'users/' + uid)
    onValue(refDb, (snapshot) => {
      const data = snapshot.val()
      if(data) {
        setCurrentUserDataDb({ ...data, uid });
      }
      setLoading(false)
    });
  }

  function updateName(name: string): Promise<void> {
    return set(ref(db, 'users/' + currentUser?.uid), 
      {
        ...currentUserDataDb,
        name: name
      }
    );
  }

  async function updateEmailUser(email: string): Promise<void> {    
    return new Promise(async (resolve, reject) => {
      try {
        await updateEmail(currentUser!, email)
        await set(ref(db, 'users/' + currentUser?.uid), 
        {
          ...currentUserDataDb,
          email: email
        })
        resolve()
      } catch(error) {
        reject(error)
      }
    })
  }

  function updatePasswordUser(newPassword: string): Promise<void> {
    return updatePassword(currentUser!, newPassword)
  }

  function reauthenticateUser(password: string): Promise<UserCredential> {
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
      if(user) {
        getUserData(user?.uid)  
        setCurrentUser(user)
      } else {
        setLoading(false)
      }
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