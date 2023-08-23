import React, { useContext, useEffect, useState } from "react"
import { useAuthContext } from "./AuthContext"
import { useHouseContext } from "./HouseContext"
import { child, get, onValue, push, ref, remove, set } from "firebase/database"
import { db } from "../firebaseConfig"
import { AppointmentType } from "../AppointmentType"

export interface AppointmentDb {
  id: string
  startingTime: string
  endingTime: string
  userId: string
  userName: string
}

interface AppointmentContextValue {
  appointmentsDb: AppointmentDb[] | null,
  createAppointment(appointmentType: AppointmentType, startingDate: Date, endingDate: Date): Promise<void>
  getAppointments(appointmentType: AppointmentType, date: string): Promise<void> 
  deleteAppointment(appointmentType: AppointmentType, date: Date, id: string): Promise<void>
}

const AppointmentContext = React.createContext({} as AppointmentContextValue)

export function useAppointmentContext() {
  return useContext(AppointmentContext)
}

export function AppointmentProvider({ children }: {children: React.ReactNode}) {
  const [appointmentsDb, setAppointmentsDb] = useState<AppointmentDb[] | null>(null)

  const authContext = useAuthContext()
  const houseContext = useHouseContext()

  function createAppointment(appointmentType: AppointmentType, startingDate: Date, endingDate: Date): Promise<void> {
    const generatedKey = push(child(ref(db), appointmentType + '/' + houseContext.houseInfoDb?.id)).key
    return new Promise(async (resolve, reject) => {
      if(startingDate > endingDate) {
        reject("The starting date cannot be later than the ending date!")
      } 
      else {
        let taken = false
        if(appointmentsDb !== null) {
          for (const element of appointmentsDb) {
            const startTimeStringHour = new Date(element.startingTime).getHours() < 10 ? `0${new Date(element.startingTime).getHours()}` : new Date(element.startingTime).getHours()
            const startTimeStringMinute = new Date(element.startingTime).getMinutes() < 10 ? `0${new Date(element.startingTime).getMinutes()}` : new Date(element.startingTime).getMinutes()
            const endingTimeStringHour = new Date(element.endingTime).getHours() < 10 ? `0${new Date(element.endingTime).getHours()}` : new Date(element.endingTime).getHours()
            const endingTimeStringMinute = new Date(element.endingTime).getMinutes() < 10 ? `0${new Date(element.endingTime).getMinutes()}` : new Date(element.endingTime).getMinutes()
            if(startingDate <= new Date(element.startingTime)) {
              if(endingDate >= new Date(element.startingTime)) {
                taken = true
                reject(`There is already an appointment at ${startTimeStringHour}:${startTimeStringMinute} - ${endingTimeStringHour}:${endingTimeStringMinute}`)
                break
              }
            } else if(startingDate >= new Date(element.startingTime)) {
              if(startingDate <= new Date(element.endingTime)) {
                taken = true
                reject(`There is already an appointment at ${startTimeStringHour}:${startTimeStringMinute} - ${endingTimeStringHour}:${endingTimeStringMinute}`)
                break
              }
            }
          }
        }
        if(!taken) {
          try {
            await set(ref(db, appointmentType + '/' + houseContext.houseInfoDb?.id + "/" + startingDate.toLocaleDateString("nl-NL") + "/" + generatedKey), {
              userId: authContext.currentUserDataDb?.uid,
              startingDate: startingDate.toString(),
              endingDate: endingDate.toString()
            })
            resolve()
          } catch(error) {
            reject(error)
          }
        }
      }
    }
  )}

  function getAppointments(appointmentType: AppointmentType, date: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const appointmentRef = ref(db, appointmentType + '/' + houseContext.houseInfoDb?.id + "/" + date)
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

  function deleteAppointment(appointmentType: AppointmentType, date: Date, id: string){
    const appointmentRef = ref(db, appointmentType + '/' + houseContext.houseInfoDb?.id + "/" + date.toLocaleDateString("nl-NL") + "/" + id)
    return remove(appointmentRef)
  }

  function compareStartingTime(a: AppointmentDb, b: AppointmentDb) {
    if (new Date(a.startingTime).getHours() < new Date(b.startingTime).getHours()) {
      return -1;
    }
    if (new Date(a.startingTime).getHours() > new Date(b.startingTime).getHours()) {
      return 1;
    }
    return 0;
  }
  
  const value: AppointmentContextValue = {
    appointmentsDb: appointmentsDb,
    createAppointment,
    getAppointments,
    deleteAppointment
  }

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  )
}