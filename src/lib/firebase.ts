// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "stuffin-main",
  "appId": "1:296303670588:web:12072f743a8a5dbef41a39",
  "storageBucket": "stuffin-main.firebasestorage.app",
  "apiKey": "AIzaSyDk8w7unFTcoyUAkbzVVG6Il_KSv01q2oc",
  "authDomain": "stuffin-main.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "296303670588"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
