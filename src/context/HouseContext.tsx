import React, { useContext, useEffect, useState } from "react"
import { ref, set, push, child, get, onValue } from "firebase/database";
import { db } from "../firebaseConfig"
import { useAuthContext } from "./AuthContext";


interface HousesDataDb {
  id: string
  name: string
}

interface HouseContextValue {
  houseInfoDb: HousesDataDb | null
  createHouse(houseName: String): Promise<unknown>
  joinHouse(houseId: string): Promise<unknown>
}

const HouseContext = React.createContext({} as HouseContextValue);

export function useHouseContext() {
  return useContext(HouseContext)
}

export function HouseProvider({ children }: {children: React.ReactNode}) {
  const authContext = useAuthContext();
  const [houseInfoDb, setHouseInfoDb] = useState<HousesDataDb | null>(null)

  function getHouseData() {
    const houseRef = ref(db, 'houses/' + authContext.currentUserDataDb?.houseId);
    onValue(houseRef, (snapshot) => {
      const key = snapshot.key
      const data = snapshot.val();
      setHouseInfoDb({id: key!, name: data.name})
    });
  }

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

  function joinHouse(houseId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      get(child(ref(db), `houses/${houseId}`))
        .then((snapshot) => {
          if (!snapshot.exists()) {
            reject("No house available with the given id!");
          } else {
            const updatedHouse = {
              ...snapshot.val(),
              users: [...snapshot.val().users, authContext.currentUser?.uid],
            };
            set(ref(db, `/houses/${houseId}`), updatedHouse)
              .then(() => {
                set(ref(db, '/users/' + authContext.currentUser?.uid), {
                ...authContext.currentUserDataDb,
                houseId: houseId
                }).catch((error) => {
                  reject(error)
                })
              })
              .catch((error) => reject(error.code));
          }
        })
        .catch((error) => reject(error));
    });
  }

  useEffect(() => {
    if(authContext.currentUserDataDb?.houseId !== undefined) {
      getHouseData()
    }
  }, [authContext.currentUserDataDb])


  const value: HouseContextValue = {
    houseInfoDb,
    createHouse,
    joinHouse
  }

  return (
    <HouseContext.Provider value={value}>
      {children}
    </HouseContext.Provider>
  )
}