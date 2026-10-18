// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // <--- EZT ADD HOZZÁ

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANlB7gb_wO9f3b6xapgUaC_Hr7qQjf2Kc",
  authDomain: "tdk-nje.firebaseapp.com",
  projectId: "tdk-nje",
  storageBucket: "tdk-nje.firebasestorage.app",
  messagingSenderId: "340362248478",
  appId: "1:340362248478:web:054be8e89b2ac0ae03490f",
  measurementId: "G-EY5PBKMTHD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);