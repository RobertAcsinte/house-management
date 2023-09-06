import { child, get, onValue, push, ref, remove, set } from "firebase/database"
import React, { useContext, useEffect, useState } from "react"
import { db } from "../firebaseConfig"
import { useHouseContext } from "./HouseContext"
import { useAuthContext } from "./AuthContext"
import mapErrorMessages from "../mapErrorMessages"

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
  getNotes(): Promise<void> ,
  addNote(date: number, pinned: boolean, title: string, content: string, id?: string): Promise<void>,
  deleteNote(id: string): Promise<void>,
  error: string | null
}

const NotesContext = React.createContext({} as NotesContextValue)

export function useNotesContext() {
  return useContext(NotesContext)
}

export function NotesProvider({children} : {children: React.ReactNode}) {
  const houseContext = useHouseContext()
  const userContext = useAuthContext()
  const [notesDb, setNotesDb] = useState<NoteDataDb[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  function addNote(date: number, pinned: boolean, title: string, content: string, id?: string): Promise<void>{
    var generatedKey = push(child(ref(db), 'notes/' + houseContext.houseInfoDb?.id)).key 
    if(id) {
      generatedKey = id
    }
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

  function getNotes(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const notesRef = ref(db, "notes/" + houseContext.houseInfoDb?.id)
        onValue(notesRef, async (snapshot) => {
          const data = snapshot.val()
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
            setError(null)
          }
          else {
            setNotesDb(null)
            reject()
            setError(mapErrorMessages("empty"))
          }
        })
      } catch (error) {
        reject();
        setError(mapErrorMessages((error as any).code))
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

  function deleteNote(id: string): Promise<void>{
    const noteRef = ref(db, "notes/" + houseContext.houseInfoDb?.id + "/" + id)
    return remove(noteRef)
  }

  useEffect(() => {
    getNotes()
  }, [houseContext.houseInfoDb])

  const value: NotesContextValue = {
    notes: notesDb,
    getNotes: getNotes,
    addNote: addNote,
    deleteNote: deleteNote,
    error: error
  }

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  )
}