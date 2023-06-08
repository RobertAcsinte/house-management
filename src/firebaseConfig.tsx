import firebase from "firebase/app"
import "firebase/auth"
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCFMoLOhKwJk3qduZfJHH2FeEyaOsGGBM8",
  authDomain: "house-management-1a54b.firebaseapp.com",
  projectId: "house-management-1a54b",
  storageBucket: "house-management-1a54b.appspot.com",
  messagingSenderId: "905878745940",
  appId: "1:905878745940:web:a2d9ce45f838cfeafe0ec1",
  measurementId: "G-YS897B0SXN",
  databaseURL: "https://house-management-1a54b-default-rtdb.europe-west1.firebasedatabase.app/",
};


const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getDatabase(app)
export default app
