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
  leaveHouse(): Promise<void>
  sendInvite(email: string): Promise<unknown>
  getHouseNameById(idhouse: string): Promise<unknown>
  onAcceptInvitation(houseId: string): Promise<any>
}

const HouseContext = React.createContext({} as HouseContextValue);

export function useHouseContext() {
  return useContext(HouseContext)
}

export function HouseProvider({ children }: {children: React.ReactNode}) {
  const authContext = useAuthContext();
  const [houseInfoDb, setHouseInfoDb] = useState<HousesDataDb | null>(null)

  function getHouseData() {
    const houseRef = ref(db, 'houses/' + authContext.currentUserDataDb?.houseId)
    onValue(houseRef, async (snapshot) => {
      const houseId = snapshot.key
      const houseName = snapshot.val().name
      const invitations = snapshot.val().invitations
      let users: UserDataDb[] = []
      let invitationsEmail: string[] = []
  
      //get info about the users who are joined the house
      const usersData = snapshot.val().users.map(async (userId: string) => {
        const userInfoFetched = await get(child(ref(db), `users/${userId}`))
        const userToAdd: UserDataDb = {
          uid: userId,
          email: userInfoFetched.val().email,
          name: userInfoFetched.val().name,
          houseId: userInfoFetched.val().houseId,
          invitationsReceivedHouseId: userInfoFetched.val().invitationsReceivedHouseId
        };
        users = [...users, userToAdd];
      })
      await Promise.all(usersData)

       //get emails from the user id for pending invitations
      if (invitations !== undefined) {
        const invitationNamesPromises = invitations.map(async (value: string) => {
          const snapshot = await get(child(ref(db), `users/${value}`));
          return snapshot.val().email;
        });
        invitationsEmail = await Promise.all(invitationNamesPromises);
      }

      setHouseInfoDb({
        id: houseId!,
        name: houseName,
        users: users,
        invitationsUsersId: invitations,
        invitationsUsersEmail: invitationsEmail
      });
    });
  }

  function changeHouseName(name: string): Promise<void> {
    return update(ref(db, `houses/${houseInfoDb?.id}`), {name: name})
  }

  function sendInvite(email: string): Promise<unknown> {
    return new Promise(async (resolve, reject) => {
      try {
        const snapshotUsers = await get(child(ref(db), 'users'));
        const usersData = snapshotUsers.val()
        const emailAddresses = Object.values(usersData).map((user: any) => user.email)
        const userId = Object.keys(usersData).find((key: string) => usersData[key].email === email)
        if (emailAddresses.includes(email)) {
          if(snapshotUsers.child(userId!).val().houseId === undefined) {
            const savedInvitationsUser = snapshotUsers.child(userId!).val().invitationsReceivedHouseId
            const updatedSavedInvitationsUser = savedInvitationsUser ? [...savedInvitationsUser, houseInfoDb?.id] : [houseInfoDb?.id]
            const invitationsToSaveHouse = houseInfoDb!.invitationsUsersId ? [...houseInfoDb!.invitationsUsersId, userId] : [userId]
            if (!houseInfoDb!.invitationsUsersId.find((userIdInvitation: any) => userIdInvitation === userId)) {
              try {
                await update(ref(db, `users/${userId}`), {invitationsReceivedHouseId: updatedSavedInvitationsUser})
                await update(ref(db, `houses/${houseInfoDb?.id}`), {invitations: invitationsToSaveHouse})
                resolve(true)
              } catch(error) {
                reject(error)
              }
            } else {
              reject("The user is already invited to this house!")
            }
          } else {
            reject("The user is already part of a house!")
          }
        } else {
          reject("No account with the given email");
        }
      } catch (error) {
        reject(error);
      }
    });    
  }

  function getHouseNameById(idhouse: string): Promise<unknown> {
    return new Promise(async (resolve, reject) => {
      try {
        const snapshot = await get(child(ref(db), 'houses/' + idhouse + '/name'))
        if(snapshot.exists()) {
          resolve(snapshot.val())
        } 
      } catch(error) {
        reject(error)
      }
    })
  }

  function leaveHouse(): Promise<void> {
    const uids = houseInfoDb?.users
      .filter((user) => user.uid !== authContext.currentUser?.uid)
      .map((user) => user.uid)
    return new Promise(async (resolve, reject) => {
      try {
        await update(ref(db, `houses/${houseInfoDb?.id}`), {users: uids})
        await update(ref(db, `users/${authContext.currentUser?.uid}`), {houseId: null})
        resolve()
      } catch(error) {
        reject(error)
      }
    })
  }

  function createHouse(houseName: string) {
    const generatedKey = push(child(ref(db), 'houses')).key;
    return new Promise(async (resolve, reject) => {
      try {
        await set(ref(db, 'houses/' + generatedKey), {
          name: houseName,
          users: [authContext.currentUser?.uid]
        })
        await set(ref(db, '/users/' + authContext.currentUser?.uid), {
          ...authContext.currentUserDataDb,
          houseId: generatedKey
        })
      } catch(error) {
        reject(error)
      }
    }
  )}

  function joinHouse(houseId: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const snapshot = await get(child(ref(db), `houses/${houseId}`));
        if (!snapshot.exists()) {
          reject("No house available with the given id!");
        } else {
          const updatedHouse = {
            ...snapshot.val(),
            users: [...snapshot.val().users, authContext.currentUser?.uid],
          }
          await set(ref(db, `/houses/${houseId}`), updatedHouse);
          await set(ref(db, `/users/${authContext.currentUser?.uid}`), {
            ...authContext.currentUserDataDb,
            houseId: houseId,
          });
          resolve();
        }
      } catch (error) {
        reject(error);
      }
    })
  }  

  function onAcceptInvitation(houseId: string): Promise<any> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await joinHouse(houseId)
        const houseInfo = await get(child(ref(db), `houses/${houseId}`))
          const updatedInvitations = houseInfo.val().invitations.filter((element: string) => element !== authContext.currentUser?.uid)
          const updatedHouse = {
            ...houseInfo.val(),
            invitations: updatedInvitations,
          };
          await set(ref(db, `houses/${houseId}`), updatedHouse)
          await get(child(ref(db), `users/${authContext.currentUser?.uid}`))
          await update(ref(db, `users/${authContext.currentUser?.uid}`), {invitationsReceivedHouseId: null})
          resolve()
      } catch(error) {
        reject(error)
      }
    })
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
    sendInvite,
    getHouseNameById,
    onAcceptInvitation
  }

  return (
    <HouseContext.Provider value={value}>
      {children}
    </HouseContext.Provider>
  )
}