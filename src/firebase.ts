import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVFiI9HEj1sND2vBjMSE0zONs66YEBgKE",
  authDomain: "nivel-sonoro.firebaseapp.com",
  databaseURL: "https://nivel-sonoro-default-rtdb.firebaseio.com",
  projectId: "nivel-sonoro",
  storageBucket: "nivel-sonoro.firebasestorage.app",
  messagingSenderId: "1020162076387",
  appId: "1:1020162076387:web:ce645256cf4bd11acd9fd6",
  measurementId: "G-7XRV9RDJ0M"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth };
