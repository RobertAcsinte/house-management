import { child, get, onValue, push, ref, set } from "firebase/database"
import React, { useContext, useEffect, useState } from "react"
import { db } from "../firebaseConfig"
import { useHouseContext } from "./HouseContext"
import { useAuthContext } from "./AuthContext"

export interface NoteDataDb {
  id: string,
  userId: string,
  userName: string
  date: number,
  pinned: boolean,
  title: string,
  content: string
}

interface NotesContextValue {
  notes: NoteDataDb[] | null,
  addNote(date: number, pinned: boolean, title: string, content: string): Promise<void>
}

const NotesContext = React.createContext({} as NotesContextValue)

export function useNotesContext() {
  return useContext(NotesContext)
}

export function NotesProvider({children} : {children: React.ReactNode}) {
  const houseContext = useHouseContext()
  const userContext = useAuthContext()
  const [notesDb, setNotesDb] = useState<NoteDataDb[] | null>(null)

  function addNote(date: number, pinned: boolean, title: string, content: string): Promise<void>{
    const generatedKey = push(child(ref(db), 'notes/' + houseContext.houseInfoDb?.id)).key 
    return new Promise(async (resolve, reject) => {
      try {
          await set(ref(db, 'notes/' + houseContext.houseInfoDb?.id + "/" + generatedKey), {
          userId: userContext.currentUser?.uid,
          date: date,
          pinned: pinned,
          title: title,
          content: content,
        })
        resolve()
      } catch(error) {
        reject(error)
      }
    })
  }

  const value: NotesContextValue = {
    notes: notesDb,
    addNote: addNote
  }

  function getNotes(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const notesRef = ref(db, "notes/" + houseContext.houseInfoDb?.id)
        onValue(notesRef, async (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const newNotesArray = await Promise.all(Object.keys(data).map(async (noteId) => {
              const note = data[noteId];
              const userInfoFetched = await get(child(ref(db), `users/${note.userId}`))
              return {
                id: noteId,
                userId: note.userId,
                userName: userInfoFetched.val().name,
                date: note.date,
                pinned: note.pinned,
                title: note.title,
                content: note.content
              }
            }))
            newNotesArray.sort(comparePinned)
            setNotesDb(newNotesArray)
            resolve()
          }
          else {
            setNotesDb(null)
            reject("No notes")
          }
        })
      } catch (error) {
        reject(error);
      }
      }) 
  }

  function comparePinned(a: NoteDataDb, b: NoteDataDb) {
    if (a.pinned < b.pinned) {
      return 1;
    }
    if (a.pinned > b.pinned) {
      return -1;
    }
    return 0;
  }

  useEffect(() => {
    getNotes()
  }, [])


  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  )
}