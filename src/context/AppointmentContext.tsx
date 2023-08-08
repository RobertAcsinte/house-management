import React, { useContext } from "react"
import { useAuthContext } from "./AuthContext"
import { useHouseContext } from "./HouseContext"
import { child, push, ref, set } from "firebase/database"
import { db } from "../firebaseConfig"

interface AppointmentDb {
  id: string
  startingTime: string
  endingTime: string
  usersId: string
}

interface AppointmentContextValue {
  createAppointment(startingDate: string, endingDate: string): Promise<void>
}

const AppointmentContext = React.createContext({} as AppointmentContextValue)

export function useAppointmentContext() {
  return useContext(AppointmentContext)
}

export function AppointmentProvider({ children }: {children: React.ReactNode}) {
  const authContext = useAuthContext()
  const houseContext = useHouseContext()

  function createAppointment(startingDate: string, endingDate: string): Promise<void> {
    const generatedKey = push(child(ref(db), 'kitchenAppointments/' + houseContext.houseInfoDb?.id)).key;
    return new Promise(async (resolve, reject) => {
      try {
        await set(ref(db, 'kitchenAppointments/' + houseContext.houseInfoDb?.id + "/" + startingDate.slice(0, 10) + "/" + generatedKey), {
          userId: authContext.currentUserDataDb?.uid,
          startingDate: startingDate,
          endingDate: endingDate
        })
        resolve()
      } catch(error) {
        reject(error)
      }
    }
  )}


  const value: AppointmentContextValue = {
    createAppointment
  }

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  )
}