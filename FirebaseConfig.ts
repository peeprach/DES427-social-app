// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuratio
const firebaseConfig = {
  apiKey: "AIzaSyBMANnWBfP4AnGQh224pVkaIdGqedaNtcE",
  authDomain: "des427-social-app-7e963.firebaseapp.com",
  projectId: "des427-social-app-7e963",
  storageBucket: "des427-social-app-7e963.firebasestorage.app",
  messagingSenderId: "1090924774998",
  appId: "1:1090924774998:web:77fcd1f1e594dcffa31df7",
  measurementId: "G-QXF4DPBNXR"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getDatabase(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);