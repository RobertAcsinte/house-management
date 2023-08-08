import React, { useContext, useEffect, useState } from "react"
import { useAuthContext } from "./AuthContext"
import { useHouseContext } from "./HouseContext"
import { child, onValue, push, ref, set } from "firebase/database"
import { db } from "../firebaseConfig"

export interface AppointmentDb {
  id: string
  startingTime: string
  endingTime: string
  usersId: string
}

interface AppointmentContextValue {
  appointmentsDb: AppointmentDb[] | null,
  createAppointment(startingDate: string, endingDate: string): Promise<void>
  getAppointments(date: string): void 
}

const AppointmentContext = React.createContext({} as AppointmentContextValue)

export function useAppointmentContext() {
  return useContext(AppointmentContext)
}

export function AppointmentProvider({ children }: {children: React.ReactNode}) {
  const [appointmentsDb, setAppointmentsDb] = useState<AppointmentDb[] | null>(null)

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

  function getAppointments(date: string): void {
    const appointmentRef = ref(db, 'kitchenAppointments/' + houseContext.houseInfoDb?.id + "/" + date)
    onValue(appointmentRef, async (snapshot) => {
      const data = snapshot.val();
      console.log(data)
      if (data) {
        const newAppointmentsArray = Object.keys(data).map((appointmentId) => {
          const appointment = data[appointmentId];
          return {
            id: appointmentId,
            startingTime: appointment.startingDate,
            endingTime: appointment.endingDate,
            usersId: appointment.userId,
          };
        });
        setAppointmentsDb(newAppointmentsArray);
      }
    })
  }
  
  const value: AppointmentContextValue = {
    appointmentsDb: appointmentsDb,
    createAppointment,
    getAppointments
  }

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  )
}