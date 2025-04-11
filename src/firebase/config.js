// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-t_kFQBha7RpjMOKPt5WjmcWXhkHMnjU",
  authDomain: "cantersoft-a8856.firebaseapp.com",
  projectId: "cantersoft-a8856",
  storageBucket: "cantersoft-a8856.firebasestorage.app",
  messagingSenderId: "419312246401",
  appId: "1:419312246401:web:f3b372f600b411ac3fb780",
  measurementId: "G-D9XXRHHQ44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);  // Aquí inicializamos Firestore

// Exportamos app y db
export { db }; // Exportamos db para poder utilizarlo en otras partes de la app
export default app;  // Exportamos la instancia por defecto para Firebase (app)
