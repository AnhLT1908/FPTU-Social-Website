// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtrpVjNqgkmKPRHm_B-NfdSuYiuxVEFE4",
  authDomain: "fptusocialwebsite.firebaseapp.com",
  projectId: "fptusocialwebsite",
  storageBucket: "fptusocialwebsite.firebasestorage.app",
  messagingSenderId: "629267901782",
  appId: "1:629267901782:web:a807255c435d944bf13af7",
  measurementId: "G-B06NJVJGVB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const imgDB = getStorage(app);

export { imgDB };
