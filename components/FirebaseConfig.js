 // Import the functions you need from the SDKs you need
 import { initializeApp } from "firebase/app";
 import { getFirestore } from "firebase/firestore";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
 
 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "REMOVED_FIREBASE_API_KEY",
   authDomain: "REMOVED_FIREBASE_AUTH_DOMAIN",
   projectId: "REMOVED_FIREBASE_PROJECT_ID",
   storageBucket: "REMOVED_FIREBASE_PROJECT_ID.appspot.com",
   messagingSenderId: "REMOVED_FIREBASE_MESSAGING_SENDER_ID",
   appId: "1:REMOVED_FIREBASE_MESSAGING_SENDER_ID:web:6df86c6a08ad48ea9113d5"
 };
 
 // Initialize Firebase
 export const app = initializeApp(firebaseConfig);
 export const db = getFirestore(app);