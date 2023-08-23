import { child, push, ref, set } from "firebase/database"
import React, { useContext, useState } from "react"
import { db } from "../firebaseConfig"
import { useHouseContext } from "./HouseContext"

interface NoteDataDb {
  id: string,
  userId: string,
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
  const [notesDb, setNotesDb] = useState<NoteDataDb[] | null>(null)

  function addNote(date: number, pinned: boolean, title: string, content: string): Promise<void>{
    const generatedKey = push(child(ref(db), 'notes/' + houseContext.houseInfoDb?.id)).key 
    return new Promise(async (resolve, reject) => {
      try {
          await set(ref(db, 'notes/' + houseContext.houseInfoDb?.id + "/" + generatedKey), {
          date: date,
          pinned: pinned,
          title: title,
          content: content
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

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  )
}