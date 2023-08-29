import React, { useState, useEffect, useContext, useRef } from "react"
import { ClipLoader } from 'react-spinners';
import { auth, db, storageFirebase } from "../firebaseConfig"
import { User, UserCredential, browserLocalPersistence, updateProfile } from "firebase/auth"
import { ref, set, onValue } from "firebase/database";
import { UploadResult, getDownloadURL, getStorage, ref as ref_storage, uploadBytes } from "firebase/storage";
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
  getAvatarURL(url: string): Promise<string> 
  uploadAvatar(file: Blob | Uint8Array | ArrayBuffer): Promise<void>
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
  const currentUser = useRef<User | null>(null)
  const [currentUserDataDb, setCurrentUserDataDb] = useState<UserDataDb | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  function register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function getAvatarURL(filename: string): Promise<string> {
    const storageRef = ref_storage(storageFirebase)
    const pathReference = ref_storage(storageRef, '/'+ filename);
    return getDownloadURL(pathReference)
  }

  function uploadAvatar(file: Blob | Uint8Array | ArrayBuffer): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if(currentUser.current) {
        const imgRef = ref_storage(storageFirebase, currentUser.current?.uid);
        await uploadBytes(imgRef, file).catch((error) => {reject(error)})
        const downloadURL = await getAvatarURL(currentUser?.current?.uid).catch((error) => reject(error))
        if(downloadURL) {
          await updateProfile(currentUser.current, { photoURL: downloadURL}).catch((error) => reject(error))
          resolve()
        }
      } else {
        reject("User not found")
      }
    })
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
        setLoading(false)
      }
    });
  }

  function updateName(name: string): Promise<void> {
    return set(ref(db, 'users/' + currentUser.current?.uid), 
      {
        ...currentUserDataDb,
        name: name
      }
    );
  }

  async function updateEmailUser(email: string): Promise<void> {    
    return new Promise(async (resolve, reject) => {
      try {
        await updateEmail(currentUser.current!, email)
        await set(ref(db, 'users/' + currentUser.current?.uid), 
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
    return updatePassword(currentUser.current!, newPassword)
  }

  function reauthenticateUser(password: string): Promise<UserCredential> {
    return reauthenticateWithCredential(currentUser.current!, EmailAuthProvider.credential(currentUser.current!.email!, password))
  }

  const value: AuthContextValue = {
    currentUser: currentUser.current,
    currentUserDataDb: currentUserDataDb,
    login,
    logout,
    register,
    getAvatarURL,
    uploadAvatar,
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
        currentUser.current = user
      }
      else {
        setLoading(false)
        setCurrentUserDataDb(null)
      }
      
    })
    
    return unsubscribe
  }, [])
  

  return (
    <AuthContext.Provider value={value}>
      { loading ? 
      <>
        <div className='center-wrapper'>
          <ClipLoader color="var(--secondary)" size="200px" /> 
          </div>
      </>
      : children }

    </AuthContext.Provider>
  )


}