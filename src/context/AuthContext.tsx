import React, { useState, useEffect, useContext } from "react"
import { auth, db } from "../firebaseConfig"
import { AuthCredential, User, UserCredential, browserLocalPersistence } from "firebase/auth"
import { ref, set, onValue } from "firebase/database";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, browserSessionPersistence, setPersistence, updateEmail, reauthenticateWithCredential } from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth/cordova";

interface AuthContextValue {
  currentUser: User | null,
  currentUserDataDb: any | null
  login: (email: string, password: string, stayLogged: boolean) => Promise<UserCredential>
  register: (email: string, password: string) => Promise<UserCredential>
  saveUserDb: (userId: string, email: string, name: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  getUserData: (uid: string) => void,
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

  function reAuth() {
    reauthenticateWithCredential(currentUser!, EmailAuthProvider.credential("fdsf", "Fdsf"))
  }

  const value: AuthContextValue = {
    currentUser: currentUser,
    currentUserDataDb: currentUserDataDb,
    login,
    register,
    saveUserDb,
    resetPassword,
    getUserData,
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
      {!loading && children}
    </AuthContext.Provider>
  )


}