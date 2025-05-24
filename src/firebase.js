// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDj5-F10syG0bHcPGlHiI99UCrdyy0KHOo",
    authDomain: "zamanla-eaec0.firebaseapp.com",
    projectId: "zamanla-eaec0",
    storageBucket: "zamanla-eaec0.firebasestorage.app",
    messagingSenderId: "962945287538",
    appId: "1:962945287538:web:5e08c83668d693f77a49eb",
    measurementId: "G-T30P8C2R97"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
