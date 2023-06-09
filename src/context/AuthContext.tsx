import React, { useState, useEffect, useContext } from "react"
import { auth, db } from "../firebaseConfig"
import { User, UserCredential, browserLocalPersistence } from "firebase/auth"
import { ref, set } from "firebase/database";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, browserSessionPersistence, setPersistence } from "firebase/auth";

interface AuthContextValue {
  currentUser: User | null
  login: (email: string, password: string, stayLogged: boolean) => Promise<UserCredential>
  register: (email: string, password: string) => Promise<UserCredential>
  saveUserDb: (userId: string, email: string, name: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

export function useAuthContext() {
  return useContext(AuthContext)
}

const AuthContext = React.createContext({} as AuthContextValue);

export function AuthProvider({ children }: {children: React.ReactNode}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })
    
    return unsubscribe
  }, [])

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

  const value: AuthContextValue = {
    currentUser: currentUser,
    login,
    register,
    saveUserDb,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )


}