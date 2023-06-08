import React, { useState, useEffect, useContext } from "react"
import { auth, db } from "../firebaseConfig"
import { User, UserCredential } from "firebase/auth"
import { ref, set } from "firebase/database";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

interface AuthContextValue {
  currentUser: User | null
  login: (email: string, password: string) => Promise<UserCredential>
  register: (email: string, password: string) => Promise<UserCredential>
  saveUserDb: (userId: string, email: string, name: string) => Promise<void>
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

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function saveUserDb(userId: string, email: string, name: string) {
    console.log("db")
    return set(ref(db, 'users/' + userId), {
      email: email,
      name: name
    });
  }

  const value: AuthContextValue = {
    currentUser: currentUser,
    login,
    register,
    saveUserDb
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )


}