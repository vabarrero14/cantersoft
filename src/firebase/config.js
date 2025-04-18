import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// Importa los servicios de autenticación:
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // 👈 Añade esto

const firebaseConfig = {
  apiKey: "AIzaSyC-t_kFQBha7RpjMOKPt5WjmcWXhkHMnjU",
  authDomain: "cantersoft-a8856.firebaseapp.com",
  projectId: "cantersoft-a8856",
  storageBucket: "cantersoft-a8856.appspot.com", // 👈 Corregí el dominio (sin .firebasestorage)
  messagingSenderId: "419312246401",
  appId: "1:419312246401:web:f3b372f600b411ac3fb780",
  measurementId: "G-D9XXRHHQ44"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // 👈 Inicializa Auth
const googleProvider = new GoogleAuthProvider(); // 👈 Configura el proveedor de Google

// Exporta todo lo necesario:
export { db, auth, googleProvider }; // 👈 Exporta auth y googleProvider
export default app;