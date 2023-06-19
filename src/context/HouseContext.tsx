import React, { useState, useEffect, useContext } from "react"
import { ref, set, push, child, onValue } from "firebase/database";
import { auth, db } from "../firebaseConfig"
import { useAuthContext } from "./AuthContext";

interface HouseContextValue {
  createHouse(houseName: String): Promise<unknown>
}

const HouseContext = React.createContext({} as HouseContextValue);

export function useHouseContext() {
  return useContext(HouseContext)
}

export function HouseProvider({ children }: {children: React.ReactNode}) {
  const authContext = useAuthContext();

  function createHouse(houseName: string) {
    const generatedKey = push(child(ref(db), 'houses')).key;
    return set(ref(db, 'houses/' + generatedKey), {
      name: houseName,
      users: [authContext.currentUser?.uid]
    }).then(() => {
      return set(ref(db, '/users/' + authContext.currentUser?.uid), {
        ...authContext.currentUserDataDb,
        houseId: generatedKey
      })
    })
    .catch((error) => {
      return new Promise((reject) => {
        reject(error.code)
      })
    })
  }


  const value: HouseContextValue = {
    createHouse
  }

  return (
    <HouseContext.Provider value={value}>
      {children}
    </HouseContext.Provider>
  )
}