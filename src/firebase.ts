import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from "firebase/firestore";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

// ضع هنا بياناتك الحقيقية من Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyASroJd1uNpRzgF9uniPA-nh0YR2rxonXo",
  authDomain: "gen-lang-client-0057470951.firebaseapp.com",
  projectId: "gen-lang-client-0057470951",
  storageBucket: "gen-lang-client-0057470951.firebasestorage.app",
  messagingSenderId: "61020782170",
  appId: "1:61020782170:web:95edcbc5e17bdacdf3a263"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-145526d0-ca0a-48b1-99cf-cac9baf44b7f");
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { 
  db, auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged,
  collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot 
};