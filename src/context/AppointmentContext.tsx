import React, { useContext, useEffect, useState } from "react"
import { useAuthContext } from "./AuthContext"
import { useHouseContext } from "./HouseContext"
import { child, get, onValue, push, ref, set } from "firebase/database"
import { db } from "../firebaseConfig"

export interface AppointmentDb {
  id: string
  startingTime: string
  endingTime: string
  userId: string
  userName: string
}

interface AppointmentContextValue {
  appointmentsDb: AppointmentDb[] | null,
  createAppointment(startingDate: string, endingDate: string): Promise<void>
  getAppointments(date: string): Promise<void> 
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
    const generatedKey = push(child(ref(db), 'kitchenAppointments/' + houseContext.houseInfoDb?.id)).key
    return new Promise(async (resolve, reject) => {
      if(new Date(startingDate) > new Date(endingDate)) {
        console.log("start bigger than end")
        reject("The starting date cannot be later than the ending date!")
      } 
      else {
        let taken = false
        if(appointmentsDb !== null) {
          for (const element of appointmentsDb) {
            if(new Date(startingDate) <= new Date(element.startingTime)) {
              if(new Date(endingDate) >= new Date(element.startingTime)) {
                taken = true
                console.log("taken")
                reject("Already taken")
                break
              }
            } else if(new Date(startingDate) >= new Date(element.startingTime)) {
              if(new Date(startingDate) <= new Date(element.endingTime)) {
                taken = true
                console.log("taken")
                reject("Already taken")
                break
              }
            }
          }
        }
        if(!taken) {
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
      }
    }
  )}

  function getAppointments(date: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const appointmentRef = ref(db, 'kitchenAppointments/' + houseContext.houseInfoDb?.id + "/" + date)
        onValue(appointmentRef, async (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const newAppointmentsArray = await Promise.all(Object.keys(data).map(async (appointmentId) => {
              const appointment = data[appointmentId];
              const userInfoFetched = await get(child(ref(db), `users/${appointment.userId}`))
              return {
                id: appointmentId,
                startingTime: appointment.startingDate,
                endingTime: appointment.endingDate,
                userId: appointment.userId,
                userName: userInfoFetched.val().name
              }
            }))
            newAppointmentsArray.sort(compareStartingTime)
            setAppointmentsDb(newAppointmentsArray)
            resolve()
          }
          else {
            setAppointmentsDb(null)
            reject("No appointments")
          }
        })
      } catch (error) {
        reject(error);
      }
      })    
  }

  function compareStartingTime(a: AppointmentDb, b: AppointmentDb) {
    if (a.startingTime < b.startingTime) {
      return -1;
    }
    if (a.startingTime > b.startingTime) {
      return 1;
    }
    return 0;
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