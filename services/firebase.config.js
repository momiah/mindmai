// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhF20OKnDZgvQoo63eGoT9CxtpRFWhPTM",
  authDomain: "mindmai-4b819.firebaseapp.com",
  projectId: "mindmai-4b819",
  storageBucket: "mindmai-4b819.appspot.com",
  messagingSenderId: "196425040906",
  appId: "1:196425040906:web:2210a1bebc878e5ced0bf3",
  measurementId: "G-M9180LZ5VJ"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)
export const db = getFirestore(FIREBASE_APP)
