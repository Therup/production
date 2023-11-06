import { initializeApp } from "firebase/app"; // Importera initializeApp från firebase/app
import { getAuth } from "firebase/auth"; // Om du behöver autentisering
import { getFirestore } from "firebase/firestore"; // Om du behöver Firestore

const firebaseConfig = {
  apiKey: "AIzaSyBaQMEXaAJVyQUy52kX7M_6Mt5X6l5hawU",
  authDomain: "hockey-5189c.firebaseapp.com",
  projectId: "hockey-5189c",
  storageBucket: "hockey-5189c.appspot.com",
  messagingSenderId: "763919776356",
  appId: "1:763919776356:web:df9f1a9e8d89f012ac3d71",
};

// Initialisera Firebase
const app = initializeApp(firebaseConfig);

// Exportera de specifika komponenter du behöver
export const auth = getAuth(app); // Exempelvis auth om du behöver autentisering
export const firestore = getFirestore(app); // Firestore om du behöver databasen
