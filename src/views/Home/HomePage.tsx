import React from 'react'
import { useEffect } from 'react';
import style from './HomePage.module.css'
import { onAuthStateChanged, getAuth } from "firebase/auth";

function HomePage() {

  let uid = "ham"
  const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          uid = user.uid;
          // ...
          console.log("uid", uid)
        } else {
          // User is signed out
          // ...
          console.log("user is logged out")
        }
      });
     


  return (
    <div>HomePage {uid}</div>
  )
}

export default HomePage