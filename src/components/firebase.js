// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoaVvh0qhdewCDWY_W3EBoooxnnFacVWQ",
  authDomain: "intern-ca93c.firebaseapp.com",//
  projectId: "intern-ca93c",
  storageBucket: "intern-ca93c.firebasestorage.app",//
  messagingSenderId: "513344989586",
  appId: "1:513344989586:web:07ca0aeeca11b2db1c394b",
//
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db=getFirestore(app);
export default app;