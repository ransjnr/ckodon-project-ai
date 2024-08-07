// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgw89_WXu5lihEJCcgOl9Ih2xOYNqIbXc",
  authDomain: "nextjs-auth-project-bf53d.firebaseapp.com",
  projectId: "nextjs-auth-project-bf53d",
  storageBucket: "nextjs-auth-project-bf53d.appspot.com",
  messagingSenderId: "614203250737",
  appId: "1:614203250737:web:85e439526340493c2d1d10",
  measurementId: "G-0LT8WH8ZDX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
export { db, auth };