// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "real-estate-45f62.firebaseapp.com",
    projectId: "real-estate-45f62",
    storageBucket: "real-estate-45f62.appspot.com",
    messagingSenderId: "378041739543",
    appId: "1:378041739543:web:1a65a90c1214531fe2af52",
    measurementId: "G-JFWBD9XQNS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);