// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCu1UmS9MqzhJPxfveKp262z9MXnJHiKF4",
  authDomain: "blog-9fc4a.firebaseapp.com",
  projectId: "blog-9fc4a",
  storageBucket: "blog-9fc4a.firebasestorage.app",
  messagingSenderId: "745689400027",
  appId: "1:745689400027:web:33140691b598d5145a42fe",
  measurementId: "G-T380WFHR1K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
