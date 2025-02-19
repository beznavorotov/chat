import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCMI7dLfOQC0_m6J_xPYek2pbURx069lhY",
    authDomain: "real-time-chat-d5d6c.firebaseapp.com",
    projectId: "real-time-chat-d5d6c",
    storageBucket: "real-time-chat-d5d6c.firebasestorage.app",
    messagingSenderId: "541159328697",
    appId: "1:541159328697:web:f2dbce1435f41e79ba4468",
    measurementId: "G-ZC0W1CSNFQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, provider, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup };
