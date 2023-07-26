import React, { useContext, useEffect, useState } from "react"
import { ref, set, push, child, get, onValue, update } from "firebase/database";
import { db } from "../firebaseConfig"
import { useAuthContext } from "./AuthContext";
import { UserDataDb } from "./AuthContext";


interface HousesDataDb {
  id: string
  name: string
  users: UserDataDb[]
  invitationsUsersId: string[]
  invitationsUsersEmail: string[]
}

interface HouseContextValue {
  houseInfoDb: HousesDataDb | null
  createHouse(houseName: String): Promise<unknown>
  joinHouse(houseId: string): Promise<unknown>
  changeHouseName(name: string): Promise<void>
  leaveHouse(): Promise<unknown>
  sendInvite(email: string): Promise<unknown>
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
    onValue(houseRef, async (snapshot) => {
      const houseId = snapshot.key;
      const houseName = snapshot.val().name;
      const invitations = snapshot.val().invitations;
      let users: UserDataDb[] = [];
  
      const userPromises = snapshot.val().users.map((userId: string) => {
        return get(child(ref(db), `users/${userId}`)).then((snapshot) => {
          if (snapshot.exists()) {
            const userToAdd: UserDataDb = {
              uid: userId,
              email: snapshot.val().email,
              name: snapshot.val().name,
              houseId: snapshot.val().houseId,
              invitationsReceivedHouseId: snapshot.val().invitationsReceivedHouseId
            };
            users = [...users, userToAdd];
          }
        });
      });
  
      await Promise.all(userPromises);
  
      let invitationNames: string[] = []
      if(invitations !== undefined) {
        const invitationNamesPromises = invitations.map((value: string) => {
          return get(child(ref(db), `users/${value}`)).then((snapshot) => {
            if (snapshot.exists()) {
              return snapshot.val().email;
            }
          });
        });
    
        invitationNames = await Promise.all(invitationNamesPromises);
      } 

  
      setHouseInfoDb({
        id: houseId!,
        name: houseName,
        users: users,
        invitationsUsersId: invitations,
        invitationsUsersEmail: invitationNames
      });
    });
  }


  function changeHouseName(name: string) {
    return update(ref(db, `houses/${houseInfoDb?.id}`), {name: name})
  }


  function sendInvite(email: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const snapshot = await get(child(ref(db), 'users'));
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const emailAddresses = Object.values(usersData).map((user: any) => user.email);
          const userId = Object.keys(usersData).find((key: string) => usersData[key].email === email);
          if (emailAddresses.includes(email)) {
            if(snapshot.child(userId!).val().houseId === undefined) {
              const savedInvitationsUser = snapshot.child(userId!).val().invitationsReceivedHouseId
              const invitationToSaveUser = savedInvitationsUser ? [...savedInvitationsUser, houseInfoDb?.id] : [houseInfoDb?.id]
              const invitationsToSaveHouse = houseInfoDb!.invitationsUsersId ? [...houseInfoDb!.invitationsUsersId, userId] : [userId]
              if(houseInfoDb!.invitationsUsersId === undefined) {
                update(ref(db, `users/${userId}`), {invitationsReceivedHouseId: invitationToSaveUser}).then(() => {
                  update(ref(db, `houses/${houseInfoDb?.id}`), {invitations: invitationsToSaveHouse})
                  .then(() => resolve(true))
                  .catch((error)=> reject(error))
                }).catch((error) => reject(error))
              } else {
                  if(!invitationsToSaveHouse.find((userIdInvitation: any) => { return userIdInvitation === userId})) {
                  } else {
                    reject("The user is already invited to this house!")
                  }
              }
            } else {
              reject("The user is already part of a house!")
            }
          } else {
            reject("No account with the given email");
          }
        } 
      } catch (error) {
        reject(error);
      }
    });    
  }


  function leaveHouse() {
    const uids = houseInfoDb?.users
    .filter((user) => user.uid !== authContext.currentUser?.uid)
    .map((user) => user.uid);
  
    return new Promise((reject) => {
      update(ref(db, `houses/${houseInfoDb?.id}`), {users: uids}).then (() => {
        update(ref(db, `users/${authContext.currentUser?.uid}`), {houseId: null})
      }).catch((error) => {
        reject(error.code)
      })
    })
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
    leaveHouse,
    changeHouseName,
    createHouse,
    joinHouse,
    sendInvite
  }

  return (
    <HouseContext.Provider value={value}>
      {children}
    </HouseContext.Provider>
  )
}