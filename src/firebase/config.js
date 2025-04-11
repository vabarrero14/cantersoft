// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export default app; // 👈 esta línea es la clave
